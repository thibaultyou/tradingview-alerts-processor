import { Order } from 'ccxt';
import {
  TRADE_EXECUTION_ERROR,
  TRADE_EXECUTION_SUCCESS,
  TRADE_EXECUTION_TIME,
  TRADE_SERVICE_ADD,
  TRADE_SERVICE_START,
  TRADE_SERVICE_STOP,
  TRADE_PROCESSING
} from '../../messages/trading.messages';
import { Side } from '../../constants/trading.constants';
import { Account } from '../../entities/account.entities';
import { Trade } from '../../entities/trade.entities';
import { ITradeInfo } from '../../interfaces/trading.interfaces';

import { error, debug, info } from '../logger.service';
import { TradeExecutionError } from '../../errors/trading.errors';
import {
  TRADE_SERVICE_ALREADY_STARTED,
  TRADE_SERVICE_ALREADY_STOPPED
} from '../../messages/trading.messages';
import {
  DELAY_BETWEEN_TRADES,
  ExchangeId
} from '../../constants/exchanges.constants';
import { ExchangeService } from '../../types/exchanges.types';
import { v4 as uuidv4 } from 'uuid';
import { initExchangeService } from '../../utils/exchanges/common.utils';

export class TradingExecutor {
  private isStarted = false;
  private executionLoop: NodeJS.Timeout;
  private id: ExchangeId;
  private exchangeService: ExchangeService;
  private trades: ITradeInfo[] = [];

  constructor(id: ExchangeId) {
    this.id = id;
    this.exchangeService = initExchangeService(id);
  }

  getExchangeService = (): ExchangeService => this.exchangeService;

  getStatus = (): boolean => this.isStarted;

  start = (): void => {
    if (!this.isStarted) {
      this.isStarted = true;
      debug(TRADE_SERVICE_START(this.id));
      this.executionLoop = setInterval(async () => {
        const tradeInfo = this.trades.shift();
        if (tradeInfo) {
          await this.processTrade(tradeInfo);
        }
      }, DELAY_BETWEEN_TRADES[this.id]);
    } else {
      debug(TRADE_SERVICE_ALREADY_STARTED(this.id));
    }
  };

  stop = (): void => {
    if (this.isStarted) {
      debug(TRADE_SERVICE_STOP(this.id));
      clearInterval(this.executionLoop);
      this.isStarted = false;
    } else {
      debug(TRADE_SERVICE_ALREADY_STOPPED(this.id));
    }
  };

  addTrade = async (account: Account, trade: Trade): Promise<boolean> => {
    const { stub, exchange } = account;
    const { symbol, direction } = trade;
    try {
      debug(TRADE_SERVICE_ADD(exchange));
      const info: ITradeInfo = {
        account,
        trade,
        id: uuidv4()
      };
      this.trades.push(info);
      debug(TRADE_EXECUTION_SUCCESS(exchange, stub, symbol, direction));
    } catch (err) {
      error(TRADE_EXECUTION_ERROR(exchange, stub, symbol, direction), err);
      throw new TradeExecutionError(
        TRADE_EXECUTION_ERROR(exchange, stub, symbol, direction, err.message)
      );
    }
    return true;
  };

  processTrade = async (tradeInfo: ITradeInfo): Promise<Order> => {
    const { account, trade, id } = tradeInfo;
    const { direction } = trade;
    try {
      const start = new Date();
      debug(TRADE_PROCESSING(id));
      const order =
        direction === Side.Close
          ? await this.exchangeService.closeOrder(account, trade)
          : await this.exchangeService.openOrder(account, trade);
      const end = new Date();
      info(TRADE_EXECUTION_TIME(start, end, id));
      return order;
    } catch (err) {
      // ignore
    }
  };
}
