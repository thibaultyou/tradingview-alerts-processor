import { Exchange, Order } from 'ccxt';
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { IPosition } from '../interfaces/exchange.interfaces';
import { ITradeInfo } from '../interfaces/trade.interface';
import { getAccountId } from '../utils/account.utils';
import {
  getAverageTradeSize,
  getInvertedTradeSide,
  getTradeSide
} from '../utils/trade.utils';
import { fetchTickerPrice } from './exchange.service';
import { info, error, close, long, short } from './logger.service';

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
    info(`Trading service started.`);
    setInterval(() => {
      const trade = this.trades.shift();
      if (trade) {
        this.processTrade(trade);
      }
      // we add a 500ms timer between each trade to avoid FTX RateLimitExceeded
    }, 500);
  };

  addTrade = (info: ITradeInfo): void => {
    this.trades.push(info);
  };

  processTrade = async (info: ITradeInfo): Promise<Order> => {
    const { account, exchange, trade } = info;
    const { direction } = trade;
    try {
      return direction === 'cancel' || direction === 'close'
        ? await this.closeTrade(exchange, account, trade)
        : await this.openTrade(exchange, account, trade);
    } catch (err) {
      error(`Failed to process trade : ${err}.`);
    }
  };

  closeTrade = async (
    exchange: Exchange,
    account: Account,
    trade: Trade
  ): Promise<Order> => {
    const { symbol, size } = trade;
    const accountId = getAccountId(account);
    try {
      const positions: IPosition[] = await exchange.fetchPositions();
      const position = positions.filter((p) => p.future === symbol).pop();
      if (!position) {
        const message = `No open position found for ${symbol}.`;
        error(message);
        throw new Error(message);
      }

      let orderSize = Number(position.size);
      if (size && size.includes('%')) {
        const percent = Number(size.replace(/\D/g, ''));
        if (percent < 1 || percent > 100) {
          throw new Error(
            `Size percentage not valid, must be between 1 and 100 : ${size}.`
          );
        }
        orderSize = (orderSize * percent) / 100;
      }

      const invertedSide = getInvertedTradeSide(position.side);
      const order: Order = await exchange.createMarketOrder(
        symbol,
        invertedSide,
        orderSize
      );
      close(`Closing trade on ${symbol} for "${accountId}" account.`);
      return order;
    } catch (err) {
      throw new Error(`Failed to close ${symbol} trade : ${err}.`);
    }
  };

  openTrade = async (
    exchange: Exchange,
    account: Account,
    trade: Trade
  ): Promise<Order> => {
    const { direction, size, symbol } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    try {
      const ticker = await fetchTickerPrice(account, symbol);
      const tradeSize = getAverageTradeSize(ticker, size);
      const order: Order = await exchange.createMarketOrder(
        symbol,
        side as 'buy' | 'sell',
        tradeSize
      );
      const message = `Opening ${side} trade on ${symbol} (${size} $US) for "${accountId}" account.`;
      side === 'buy' ? long(message) : short(message);
      return order;
    } catch (err) {
      throw new Error(
        `Failed to open ${side} trade on ${symbol} for "${accountId}" account : ${err}.`
      );
    }
  };
}
