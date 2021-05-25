import { Exchange, Order } from 'ccxt';
import { DELAY_BETWEEN_TRADES } from '../constants/env.constants';
import {
  CLOSE_TRADE_ERROR,
  CLOSE_TRADE_ERROR_NOT_FOUND,
  CLOSE_TRADE_SUCCESS,
  OPEN_TRADE_ERROR,
  OPEN_TRADE_SUCCESS,
  TRADE_SERVICE_ADD,
  TRADE_SERVICE_INIT
} from '../messages/trade.messages';
import { Side } from '../constants/trade.constants';
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { IPosition } from '../interfaces/exchange.interfaces';
import { ITradeInfo } from '../interfaces/trade.interface';
import { getAccountId } from '../utils/account.utils';
import {
  getAverageTradeSize,
  getInvertedTradeSide,
  getOrderSize,
  getTradeSide
} from '../utils/trade.utils';
import { fetchTickerPrice } from './exchange.service';
import { error, close, long, short, debug } from './logger.service';
import { ClosePositionError, OpenPositionError } from '../errors/trade.errors';

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
      const trade = this.trades.shift();
      if (trade) {
        this.processTrade(trade);
      }
      // we add a timer between each trade to avoid FTX RateLimitExceeded exception
    }, DELAY_BETWEEN_TRADES);
  };

  addTrade = (info: ITradeInfo): void => {
    this.trades.push(info);
    debug(TRADE_SERVICE_ADD);
  };

  processTrade = async (info: ITradeInfo): Promise<Order> => {
    const { account, exchange, trade } = info;
    const { direction } = trade;
    try {
      return direction === Side.Close
        ? await this.closeTrade(exchange, account, trade)
        : await this.openTrade(exchange, account, trade);
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
      const positions: IPosition[] = await exchange.fetchPositions();
      const position = positions.filter((p) => p.future === symbol).pop();
      if (!position) {
        error(CLOSE_TRADE_ERROR_NOT_FOUND(id, symbol));
        throw new ClosePositionError(CLOSE_TRADE_ERROR_NOT_FOUND(id, symbol));
      }
      const orderSize = getOrderSize(size, position.size);
      const invertedSide = getInvertedTradeSide(position.side as Side);
      const order: Order = await exchange.createMarketOrder(
        symbol,
        invertedSide,
        orderSize
      );
      close(CLOSE_TRADE_SUCCESS(id, symbol, size));
      return order;
    } catch (err) {
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
      const ticker = await fetchTickerPrice(account, symbol);
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
      error(OPEN_TRADE_ERROR(id, symbol, side));
      throw new OpenPositionError(OPEN_TRADE_ERROR(id, symbol, side));
    }
  };
}
