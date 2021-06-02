import { Exchange, Order } from 'ccxt';
import { DELAY_BETWEEN_TRADES } from '../constants/env.constants';
import {
  CLOSE_TRADE_ERROR,
  CLOSE_TRADE_ERROR_NOT_FOUND,
  CLOSE_TRADE_SUCCESS,
  OPEN_TRADE_ERROR,
  OPEN_TRADE_SUCCESS,
  TRADE_EXECUTION_ERROR,
  TRADE_EXECUTION_SUCCESS,
  TRADE_EXECUTION_TIME,
  TRADE_SERVICE_ADD,
  TRADE_SERVICE_INIT
} from '../messages/trade.messages';
import { Side } from '../constants/trade.constants';
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { IPosition } from '../interfaces/exchange.interfaces';
import { ITradeInfo } from '../interfaces/trade.interface';
import { getAccountId } from '../utils/account.utils';
import ccxt = require('ccxt');

import {
  getAverageTradeSize,
  getInvertedTradeSide,
  getOrderSize,
  getTradeSide
} from '../utils/trade.utils';
import { fetchTickerInfo } from './exchange.service';
import { error, close, long, short, debug, info } from './logger.service';
import { ClosePositionError, OpenPositionError } from '../errors/trade.errors';
import { TradeExecutionError } from '../errors/exchange.errors';

export class TradingService {
  private static instance: TradingService;
  trades: ITradeInfo[];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    this.trades = [];
  }

  public static getInstance = (): TradingService => {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  };

  start = (): void => {
    debug(TRADE_SERVICE_INIT);
    setInterval(() => {
      const tradeInfo = this.trades.shift();
      if (tradeInfo) {
        const { exchange, account, trade } = tradeInfo;
        this.processTrade(exchange, account, trade);
      }
      // we add a timer between each trade to avoid FTX RateLimitExceeded exception
      // TODO adjust delays according to exchanges specific rules
    }, DELAY_BETWEEN_TRADES);
  };

  addTrade = async (
    exchange: ccxt.Exchange,
    account: Account,
    trade: Trade
  ): Promise<boolean> => {
    const { stub } = account;
    const { symbol, direction } = trade;
    try {
      debug(TRADE_SERVICE_ADD);
      this.trades.push({ exchange, account, trade });
      debug(TRADE_EXECUTION_SUCCESS(stub, symbol, direction));
    } catch (err) {
      debug(err);
      error(TRADE_EXECUTION_ERROR(stub, symbol, direction));
      throw new TradeExecutionError(
        TRADE_EXECUTION_ERROR(stub, symbol, direction, err.message)
      );
    }
    return true;
  };

  processTrade = async (
    exchange: ccxt.Exchange,
    account: Account,
    trade: Trade
  ): Promise<Order> => {
    const { direction } = trade;
    try {
      const start = new Date();
      const order =
        direction === Side.Close
          ? await this.closeTrade(exchange, account, trade)
          : await this.openTrade(exchange, account, trade);
      const end = new Date();
      info(TRADE_EXECUTION_TIME(start, end));
      return order;
    } catch (err) {
      // ignore
    }
  };

  closeTrade = async (
    exchange: Exchange,
    account: Account,
    trade: Trade
  ): Promise<Order> => {
    const { symbol, size } = trade;
    const id = getAccountId(account);
    try {
      let currentSize;
      let orderSide = 'sell';
      const ticker = await fetchTickerInfo(exchange, account, symbol);
      if (ticker.info.type === 'spot') {
        const balances = await getAccountBalances(exchange, account);
        currentSize = balances
          .filter((b) => b.coin === ticker.info.baseCurrency)
          .pop().free;
      } else {
        const positions: IPosition[] = await exchange.fetchPositions();
        const position = positions.filter((p) => p.future === symbol).pop();
        currentSize = position.size;
        orderSide = getInvertedTradeSide(position.side as Side);
      }
      if (!currentSize) {
        error(CLOSE_TRADE_ERROR_NOT_FOUND(id, symbol));
        throw new ClosePositionError(CLOSE_TRADE_ERROR_NOT_FOUND(id, symbol));
      }
      const orderSize = getOrderSize(size, currentSize);
      const order: Order = await exchange.createMarketOrder(
        symbol,
        orderSide as 'sell' | 'buy',
        orderSize
      );
      close(CLOSE_TRADE_SUCCESS(id, symbol, size));
      return order;
    } catch (err) {
      debug(err);
      error(CLOSE_TRADE_ERROR(id, symbol));
      throw new ClosePositionError(CLOSE_TRADE_ERROR(id, symbol));
    }
  };

  openTrade = async (
    exchange: Exchange,
    account: Account,
    trade: Trade
  ): Promise<Order> => {
    const { direction, size, symbol } = trade;
    const id = getAccountId(account);
    const side = getTradeSide(direction);
    try {
      const ticker = await fetchTickerInfo(exchange, account, symbol);
      const tradeSize = getAverageTradeSize(ticker, size);
      const order: Order = await exchange.createMarketOrder(
        symbol,
        side as 'buy' | 'sell',
        tradeSize
      );
      side === Side.Buy
        ? long(OPEN_TRADE_SUCCESS(id, symbol, side, size))
        : short(OPEN_TRADE_SUCCESS(id, symbol, side, size));
      return order;
    } catch (err) {
      debug(err);
      error(OPEN_TRADE_ERROR(id, symbol, side));
      throw new OpenPositionError(OPEN_TRADE_ERROR(id, symbol, side));
    }
  };
}
