import { Order, Exchange, Ticker } from 'ccxt';
import {
  BUY_TRADE_SUCCESS,
  CLOSE_TRADE_ERROR,
  CLOSE_TRADE_SUCCESS,
  OPEN_LONG_TRADE_SUCCESS,
  OPEN_SHORT_TRADE_SUCCESS,
  OPEN_TRADE_ERROR,
  REVERSING_TRADE,
  SELL_TRADE_SUCCESS,
  TRADE_EXECUTION_ERROR,
  TRADE_EXECUTION_SUCCESS,
  TRADE_EXECUTION_TIME,
  TRADE_SERVICE_ADD,
  TRADE_SERVICE_START,
  TRADE_SERVICE_STOP
} from '../messages/trade.messages';
import { Side } from '../constants/trade.constants';
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { ITradeInfo } from '../interfaces/trade.interface';
import { getAccountId } from '../utils/account.utils';
import {
  getAverageTradeSize,
  getCloseOrderOptions,
  getSizeInDollars,
  getTradeSide,
  handleMaxBudget
} from '../utils/trade.utils';
import { fetchTickerInfo } from './exchange.service';
import { error, close, long, short, debug, info } from './logger.service';
import { ClosePositionError, OpenPositionError } from '../errors/trade.errors';
import { TradeExecutionError } from '../errors/exchange.errors';
import {
  TRADE_SERVICE_ALREADY_STARTED,
  TRADE_SERVICE_ALREADY_STOPPED
} from '../messages/trade.messages';
import {
  DELAY_BETWEEN_TRADES,
  ExchangeId
} from '../constants/exchanges.constants';
import { getFTXFuturesReversePositionStatus } from '../utils/exchanges/ftx.utils';
import { getBinanceFuturesReversePositionStatus } from '../utils/exchanges/binance.utils';

export class TradingExecutor {
  private isStarted = false;
  private executionLoop: NodeJS.Timeout;
  private id: ExchangeId;
  private trades: ITradeInfo[] = [];

  constructor(exchange: ExchangeId) {
    this.id = exchange;
  }

  getStatus = (): boolean => this.isStarted;

  start = (): void => {
    if (!this.isStarted) {
      debug(TRADE_SERVICE_START(this.id));
      this.executionLoop = setInterval(() => {
        const tradeInfo = this.trades.shift();
        if (tradeInfo) {
          const { exchange, account, trade } = tradeInfo;
          this.processTrade(exchange, account, trade);
        }
      }, DELAY_BETWEEN_TRADES[this.id]);
      this.isStarted = true;
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

  addTrade = async (
    instance: Exchange,
    account: Account,
    trade: Trade
  ): Promise<boolean> => {
    const { stub, exchange } = account;
    const { symbol, direction } = trade;
    try {
      debug(TRADE_SERVICE_ADD(exchange));
      this.trades.push({ exchange: instance, account, trade });
      debug(TRADE_EXECUTION_SUCCESS(exchange, stub, symbol, direction));
    } catch (err) {
      error(TRADE_EXECUTION_ERROR(exchange, stub, symbol, direction), err);
      throw new TradeExecutionError(
        TRADE_EXECUTION_ERROR(exchange, stub, symbol, direction, err.message)
      );
    }
    return true;
  };

  processTrade = async (
    instance: Exchange,
    account: Account,
    trade: Trade
  ): Promise<Order> => {
    const { direction } = trade;
    try {
      const start = new Date();
      const order =
        direction === Side.Close
          ? await this.closeOrder(instance, account, trade)
          : await this.openOrder(instance, account, trade);
      const end = new Date();
      info(TRADE_EXECUTION_TIME(start, end));
      return order;
    } catch (err) {
      // ignore
    }
  };

  closeOrder = async (
    instance: Exchange,
    account: Account,
    trade: Trade,
    loadedTicker?: Ticker
  ): Promise<Order> => {
    const { symbol, size } = trade;
    const { exchange } = account;
    const id = getAccountId(account);
    try {
      const ticker = loadedTicker
        ? loadedTicker
        : await fetchTickerInfo(instance, account, symbol);
      const options = await getCloseOrderOptions(
        instance,
        account,
        trade,
        ticker
      );
      const order = await instance.createMarketOrder(
        symbol,
        options.side,
        Number(options.size)
      );

      const percentage = size && size.includes('%') ? size : '100%';
      const absoluteSize = getSizeInDollars(exchange, ticker, options.size);

      close(
        CLOSE_TRADE_SUCCESS(exchange, id, symbol, absoluteSize, percentage)
      );
      return order;
    } catch (err) {
      error(CLOSE_TRADE_ERROR(exchange, id, symbol), err);
      throw new ClosePositionError(CLOSE_TRADE_ERROR(exchange, id, symbol));
    }
  };

  openOrder = async (
    instance: Exchange,
    account: Account,
    trade: Trade
  ): Promise<Order> => {
    const { direction, size, max, symbol, reverse } = trade;
    const { exchange } = account;
    const id = getAccountId(account);
    const side = getTradeSide(direction);
    try {
      const ticker = await fetchTickerInfo(instance, account, symbol);
      if (reverse) {
        await this.handleReversePosition(instance, account, trade, ticker);
      }
      const orderSize = getAverageTradeSize(exchange, ticker, size);
      if (max) {
        await handleMaxBudget(instance, account, ticker, trade, orderSize);
      }
      const order: Order = await instance.createMarketOrder(
        symbol,
        side as 'buy' | 'sell',
        orderSize
      );
      if (
        exchange === ExchangeId.BinanceFuturesUSD ||
        (exchange === ExchangeId.FTX && ticker.info.type === 'future')
      ) {
        side === Side.Buy
          ? long(OPEN_LONG_TRADE_SUCCESS(exchange, id, symbol, size))
          : short(OPEN_SHORT_TRADE_SUCCESS(exchange, id, symbol, size));
      } else if (
        exchange === ExchangeId.Binance ||
        (exchange === ExchangeId.FTX && ticker.info.type === 'spot')
      ) {
        side === Side.Buy
          ? long(BUY_TRADE_SUCCESS(exchange, id, symbol, size))
          : short(SELL_TRADE_SUCCESS(exchange, id, symbol, size));
      }
      return order;
    } catch (err) {
      error(OPEN_TRADE_ERROR(exchange, id, symbol, side), err);
      throw new OpenPositionError(OPEN_TRADE_ERROR(exchange, id, symbol, side));
    }
  };

  handleReversePosition = async (
    instance: Exchange,
    account: Account,
    trade: Trade,
    ticker: Ticker
  ): Promise<void> => {
    const { symbol } = trade;
    const { exchange } = account;
    const id = getAccountId(account);
    let needReversing = false;
    if (exchange === ExchangeId.FTX && ticker.info.type === 'future') {
      needReversing = await getFTXFuturesReversePositionStatus(
        instance,
        account,
        trade
      );
    } else if (exchange === ExchangeId.BinanceFuturesUSD) {
      needReversing = await getBinanceFuturesReversePositionStatus(
        instance,
        account,
        trade
      );
    }
    if (needReversing) {
      debug(REVERSING_TRADE(exchange, id, symbol));
      await this.closeOrder(instance, account, trade, ticker);
    }
  };
}
