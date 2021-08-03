import { Exchange, Order, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { ExchangeId } from '../../../constants/exchanges.constants';
import { getAccountId } from '../../../utils/account.utils';
import ccxt = require('ccxt');
import {
  AVAILABLE_FUNDS,
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS,
  EXCHANGE_INIT_ERROR,
  EXCHANGE_INIT_SUCCESS,
  MARKETS_READ_ERROR,
  MARKETS_READ_SUCCESS,
  TICKER_READ_ERROR,
  TICKER_READ_SUCCESS
} from '../../../messages/exchanges.messages';
import { close, debug, error, long, short } from '../../logger.service';
import {
  ExchangeInstanceInitError,
  MarketsFetchError,
  TickerFetchError
} from '../../../errors/exchange.errors';
import { Trade } from '../../../entities/trade.entities';
import { IOrderOptions } from '../../../interfaces/trading.interfaces';
import {
  CLOSE_TRADE_ERROR,
  CLOSE_TRADE_SUCCESS,
  OPEN_LONG_TRADE_SUCCESS,
  OPEN_SHORT_TRADE_SUCCESS,
  OPEN_TRADE_ERROR,
  TRADE_CALCULATED_SIZE_ERROR
} from '../../../messages/trading.messages';
import {
  ClosePositionError,
  OpenPositionError,
  OrderSizeError
} from '../../../errors/trading.errors';
import { Side, TradingMode } from '../../../constants/trading.constants';
import { getTradeSide } from '../../../utils/trading.utils';
import {
  getExchangeOptions,
  getRelativeTradeSize,
  getSpotQuote,
  getTokensAmount
} from '../../../utils/exchanges/common.exchange.utils';
import {
  IBalance,
  ISession
} from '../../../interfaces/exchanges/common.exchange.interfaces';
import { IMarket } from '../../../interfaces/market.interfaces';
import { isFTXSpot } from '../../../utils/exchanges/ftx.exchange.utils';
import { IFTXAccountInformations } from '../../../interfaces/exchanges/ftx.exchange.interfaces';

export abstract class BaseExchangeService {
  exchangeId: ExchangeId;
  defaultExchange: Exchange;
  sessions = new Map<string, ISession>(); // account id, exchange session

  constructor(exchangeId: ExchangeId) {
    this.exchangeId = exchangeId;
    this.defaultExchange = new ccxt[exchangeId]();
  }

  abstract getCloseOrderOptions(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions>;

  abstract handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;

  abstract handleOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  abstract getBalances(
    account: Account,
    instance?: Exchange
  ): Promise<IBalance[]>;

  abstract getOrderCost(ticker: Ticker, size: number): number;

  abstract handleMaxBudget(
    account: Account,
    ticker: Ticker,
    trade: Trade,
    balance: number
  ): Promise<void>;

  checkCredentials = async (
    account: Account,
    instance: Exchange
  ): Promise<boolean> => {
    const accountId = getAccountId(account);
    try {
      await this.getBalances(account, instance);
      debug(EXCHANGE_AUTHENTICATION_SUCCESS(accountId, this.exchangeId));
    } catch (err) {
      error(EXCHANGE_AUTHENTICATION_ERROR(accountId, this.exchangeId), err);
      throw new ExchangeInstanceInitError(
        EXCHANGE_AUTHENTICATION_ERROR(accountId, this.exchangeId, err.message)
      );
    }
    return true;
  };

  refreshSession = async (account: Account): Promise<ISession> => {
    const accountId = getAccountId(account);
    let session = this.sessions.get(accountId);
    if (!session) {
      try {
        const options = getExchangeOptions(this.exchangeId, account);
        const instance = new ccxt[this.exchangeId](options);
        await this.checkCredentials(account, instance);
        this.sessions.set(accountId, { exchange: instance, account });
      } catch (err) {
        error(EXCHANGE_INIT_ERROR(accountId, this.exchangeId), err);
        throw new ExchangeInstanceInitError(
          EXCHANGE_INIT_ERROR(accountId, this.exchangeId, err.message)
        );
      }
    }
    // we double check here
    session = this.sessions.get(accountId);
    if (!session) {
      error(EXCHANGE_INIT_ERROR(accountId, this.exchangeId));
      throw new ExchangeInstanceInitError(
        EXCHANGE_INIT_ERROR(accountId, this.exchangeId)
      );
    }
    debug(EXCHANGE_INIT_SUCCESS(accountId, this.exchangeId));
    return session;
  };

  getTicker = async (symbol: string): Promise<Ticker> => {
    try {
      const ticker: Ticker = await this.defaultExchange.fetchTicker(symbol);
      debug(TICKER_READ_SUCCESS(this.exchangeId, symbol, ticker));
      return ticker;
    } catch (err) {
      error(TICKER_READ_ERROR(this.exchangeId, symbol), err);
      throw new TickerFetchError(
        TICKER_READ_ERROR(this.exchangeId, symbol, err.message)
      );
    }
  };

  getMarkets = async (): Promise<IMarket[]> => {
    try {
      const markets: ccxt.Market[] = await this.defaultExchange.fetchMarkets();
      const availableMarkets = markets.flatMap((m) =>
        m.active
          ? {
              id: m.id,
              symbol: m.symbol,
              base: m.base,
              quote: m.quote,
              type: m.type
            }
          : undefined
      );
      debug(MARKETS_READ_SUCCESS(this.exchangeId));
      return availableMarkets;
    } catch (err) {
      error(MARKETS_READ_ERROR(this.exchangeId), err);
      throw new MarketsFetchError(
        MARKETS_READ_ERROR(this.exchangeId, err.message)
      );
    }
  };

  getAvailableFunds = async (
    account: Account,
    quote: string
  ): Promise<number> => {
    const balances = await this.getBalances(account);
    const balance = balances.filter((b) => b.coin === quote).pop();
    return Number(balance.free);
  };

  handleOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    const { mode } = trade;
    if (mode === TradingMode.Reverse) {
      await this.handleReverseOrder(account, ticker, trade);
    } else if (mode === TradingMode.Overflow) {
      const isOverflowing = await this.handleOverflow(account, ticker, trade);
      if (isOverflowing) {
        return false; // on overflow we only close position
      }
    }
    return true;
  };

  checkOrderPreconditions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade,
    balance: number,
    orderSize: number
  ): Promise<void> => {
    const { max } = trade;
    if (orderSize > balance) {
      // TODO create dedicated error
      throw new Error('Insufficient funds');
    }
    if (max) {
      await this.handleMaxBudget(account, ticker, trade, balance);
    }
  };

  getOpenOrderSize = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<number> => {
    const { symbol, last, info } = ticker;
    const { size } = trade;
    const accountId = getAccountId(account);
    try {
      const quoteCurrency = getSpotQuote(symbol);
      let availableFunds = 0;
      if (this.exchangeId === ExchangeId.FTX && !isFTXSpot(ticker)) {
        const accountInfos: IFTXAccountInformations = (
          await this.sessions.get(accountId).exchange.privateGetAccount()
        ).result;
        availableFunds = Number(accountInfos.freeCollateral); // FTX futures
      } else {
        availableFunds = await this.getAvailableFunds(account, quoteCurrency); // default
      }

      debug(
        AVAILABLE_FUNDS(
          accountId,
          this.exchangeId,
          quoteCurrency,
          availableFunds
        )
      );
      let orderSize = Number(size);
      if (size.includes('%')) {
        orderSize = getRelativeTradeSize(ticker, availableFunds, size);
      }
      this.checkOrderPreconditions(
        account,
        ticker,
        trade,
        availableFunds,
        orderSize
      );

      const tickerPrice = last
        ? last // KuCoin
        : info.price // FTX
        ? info.price
        : info.lastPrice; // Binance
      return getTokensAmount(symbol, tickerPrice, Number(orderSize));
    } catch (err) {
      error(TRADE_CALCULATED_SIZE_ERROR(symbol, err));
      throw new OrderSizeError(TRADE_CALCULATED_SIZE_ERROR(symbol, err));
    }
  };

  openOrder = async (account: Account, trade: Trade): Promise<Order> => {
    await this.refreshSession(account);
    const { direction, symbol } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    try {
      const ticker = await this.getTicker(symbol);
      const orderSize = await this.getOpenOrderSize(account, ticker, trade);
      const cost = this.getOrderCost(ticker, orderSize);
      const isOpenOrderAllowed = await this.handleOrderOptions(
        account,
        ticker,
        trade
      );
      // TODO refacto
      if (side === Side.Sell) {
        if (
          this.exchangeId === ExchangeId.Binance ||
          (this.exchangeId === ExchangeId.FTX && isFTXSpot(ticker))
        ) {
          return await this.closeOrder(account, trade, ticker);
        }
      }

      if (isOpenOrderAllowed) {
        const order: Order = await this.sessions
          .get(accountId)
          .exchange.createMarketOrder(
            symbol,
            side as 'buy' | 'sell',
            orderSize
          );
        side === Side.Buy
          ? long(
              OPEN_LONG_TRADE_SUCCESS(
                this.exchangeId,
                accountId,
                symbol,
                cost.toFixed(2)
              )
            )
          : short(
              OPEN_SHORT_TRADE_SUCCESS(
                this.exchangeId,
                accountId,
                symbol,
                cost.toFixed(2)
              )
            );
        return order;
      }
    } catch (err) {
      error(OPEN_TRADE_ERROR(this.exchangeId, accountId, symbol, side), err);
      throw new OpenPositionError(
        OPEN_TRADE_ERROR(this.exchangeId, accountId, symbol, side)
      );
    }
  };

  closeOrder = async (
    account: Account,
    trade: Trade,
    ticker?: Ticker
  ): Promise<Order> => {
    await this.refreshSession(account);
    const { symbol } = trade;
    const accountId = getAccountId(account);
    try {
      if (!ticker) {
        ticker = await this.getTicker(symbol);
      }
      const options = await this.getCloseOrderOptions(account, ticker, trade);
      const order = await this.sessions
        .get(accountId)
        .exchange.createMarketOrder(symbol, options.side, options.size);
      const cost = this.getOrderCost(ticker, options.size);
      close(
        CLOSE_TRADE_SUCCESS(
          this.exchangeId,
          accountId,
          symbol,
          options.size,
          cost.toFixed(2)
        )
      );
      return order;
    } catch (err) {
      error(CLOSE_TRADE_ERROR(this.exchangeId, accountId, symbol), err);
      throw new ClosePositionError(
        CLOSE_TRADE_ERROR(this.exchangeId, accountId, symbol)
      );
    }
  };
}
