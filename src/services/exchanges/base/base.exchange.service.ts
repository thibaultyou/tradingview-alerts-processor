import { Exchange, Order, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { ExchangeId } from '../../../constants/exchanges.constants';
import { getAccountId } from '../../../utils/account.utils';
import ccxt = require('ccxt');
import {
  AVAILABLE_FUNDS,
  BALANCES_READ_ERROR,
  BALANCES_READ_SUCCESS,
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS,
  EXCHANGE_INIT_ERROR,
  EXCHANGE_INIT_SUCCESS,
  MARKETS_READ_ERROR,
  MARKETS_READ_SUCCESS,
  TICKER_BALANCE_MISSING_ERROR,
  TICKER_READ_ERROR,
  TICKER_READ_SUCCESS
} from '../../../messages/exchanges.messages';
import { close, debug, error, info, long, short } from '../../logger.service';
import {
  BalancesFetchError,
  ExchangeInstanceInitError,
  MarketsFetchError,
  TickerFetchError
} from '../../../errors/exchange.errors';
import { Trade } from '../../../entities/trade.entities';
import { IOrderOptions } from '../../../interfaces/trading.interfaces';
import {
  CLOSE_TRADE_ERROR,
  CLOSE_TRADE_SUCCESS,
  CREATE_ORDER_ERROR,
  OPEN_LONG_TRADE_SUCCESS,
  OPEN_SHORT_TRADE_SUCCESS,
  OPEN_TRADE_ERROR,
  TRADE_CALCULATED_SIZE_ERROR
} from '../../../messages/trading.messages';
import {
  ClosePositionError,
  CreateOrderError,
  OpenPositionError,
  OrderSizeError
} from '../../../errors/trading.errors';
import { Side } from '../../../constants/trading.constants';
import {
  IBalance,
  ISession
} from '../../../interfaces/exchanges/common.exchange.interfaces';
import { IMarket } from '../../../interfaces/market.interfaces';
import { isFTXSpot } from '../../../utils/exchanges/ftx.utils';
import { IFTXAccountInformations } from '../../../interfaces/exchanges/ftx.exchange.interfaces';
import {
  getExchangeOptions,
  isSpotExchange
} from '../../../utils/exchanges/common.utils';
import { getSpotQuote } from '../../../utils/trading/symbol.utils';
import { getSide } from '../../../utils/trading/side.utils';
import {
  getOrderCost,
  getRelativeOrderSize,
  getTokensAmount
} from '../../../utils/trading/conversion.utils';
import { getTickerPrice } from '../../../utils/trading/ticker.utils';
import { filterBalances } from '../../../utils/trading/balance.utils';

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

  // abstract handleReverseOrder(
  //   account: Account,
  //   ticker: Ticker,
  //   trade: Trade
  // ): Promise<void>;

  // abstract handleOverflow(
  //   account: Account,
  //   ticker: Ticker,
  //   trade: Trade
  // ): Promise<boolean>;

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

  getBalances = async (
    account: Account,
    instance?: Exchange
  ): Promise<IBalance[]> => {
    const accountId = getAccountId(account);
    try {
      if (!instance) {
        instance = (await this.refreshSession(account)).exchange;
      }
      const balances = await instance.fetch_balance();
      debug(BALANCES_READ_SUCCESS(this.exchangeId, accountId));
      return filterBalances(balances, this.exchangeId);
    } catch (err) {
      error(BALANCES_READ_ERROR(this.exchangeId, accountId), err);
      throw new BalancesFetchError(
        BALANCES_READ_ERROR(this.exchangeId, accountId, err.message)
      );
    }
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
      // TODO refacto
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
    ticker: Ticker
  ): Promise<number> => {
    const { symbol } = ticker;
    const accountId = getAccountId(account);
    const quote = getSpotQuote(symbol);
    // TODO refacto
    let availableFunds = 0;
    if (this.exchangeId === ExchangeId.FTX && !isFTXSpot(ticker)) {
      const accountInfos: IFTXAccountInformations = (
        await this.sessions.get(accountId).exchange.privateGetAccount()
      ).result;
      availableFunds = Number(accountInfos.freeCollateral);
    } else {
      const balances = await this.getBalances(account);
      const balance = balances.filter((b) => b.coin === quote).pop();
      if (!balance) {
        error(TICKER_BALANCE_MISSING_ERROR(this.exchangeId, accountId, symbol));
        throw new TickerFetchError(
          TICKER_BALANCE_MISSING_ERROR(this.exchangeId, accountId, symbol)
        );
      }
      availableFunds = Number(balance.free);
    }
    info(AVAILABLE_FUNDS(accountId, this.exchangeId, quote, availableFunds));
    return availableFunds;
  };

  // handleOrderModes = async (
  //   account: Account,
  //   ticker: Ticker,
  //   trade: Trade
  // ): Promise<boolean> => {
  //   const { mode } = trade;
  //   if (mode === TradingMode.Reverse) {
  //     await this.handleReverseOrder(account, ticker, trade);
  //   } else if (mode === TradingMode.Overflow) {
  //     const isOverflowing = await this.handleOverflow(account, ticker, trade);
  //     if (isOverflowing) {
  //       return false; // on overflow we only close position
  //     }
  //   }
  //   return true;
  // };

  getOpenOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    const { symbol } = ticker;
    const { size, max, direction } = trade;
    const side = getSide(direction);
    try {
      // TODO refacto
      let orderSize = Number(size);
      if (size.includes('%') || max) {
        const funds = await this.getAvailableFunds(account, ticker); // avoid this call if possible
        if (size.includes('%')) {
          orderSize = getRelativeOrderSize(funds, size);
        }
        if (max) {
          await this.handleMaxBudget(account, ticker, trade, funds);
        }
      }
      // if (isSpotExchange(ticker, this.exchangeId) && orderSize > funds) {
      //   // TODO create dedicated error
      //   throw new Error('Insufficient funds');
      // }
      ///

      const tickerPrice = getTickerPrice(ticker, this.exchangeId);
      return {
        size: getTokensAmount(symbol, tickerPrice, Number(orderSize)),
        side: side as 'buy' | 'sell'
      };
    } catch (err) {
      error(TRADE_CALCULATED_SIZE_ERROR(symbol, err));
      throw new OrderSizeError(TRADE_CALCULATED_SIZE_ERROR(symbol, err));
    }
  };

  createOrder = async (account: Account, trade: Trade): Promise<Order> => {
    await this.refreshSession(account);
    const { symbol, direction } = trade;
    const accountId = getAccountId(account);
    try {
      const ticker = await this.getTicker(symbol);
      // const isOrderAllowed = await this.handleOrderModes(
      //   account,
      //   ticker,
      //   trade
      // );
      // if (isOrderAllowed) {
      // TODO refacto
      // close on sell spot order
      if (
        getSide(direction) === Side.Sell &&
        isSpotExchange(ticker, this.exchangeId)
      ) {
        return await this.createCloseOrder(account, trade, ticker);
      } else {
        return await this.createOpenOrder(account, trade, ticker);
      }
      // }
    } catch (err) {
      error(CREATE_ORDER_ERROR(this.exchangeId, accountId, trade), err);
      throw new CreateOrderError(
        CREATE_ORDER_ERROR(this.exchangeId, accountId, trade)
      );
    }
  };

  createOpenOrder = async (
    account: Account,
    trade: Trade,
    ticker?: Ticker // can be preloaded in openOrder
  ): Promise<Order> => {
    const accountId = getAccountId(account);
    const { symbol } = trade;
    try {
      const { side, size } = await this.getOpenOrderOptions(
        account,
        ticker,
        trade
      );
      const cost = getOrderCost(ticker, this.exchangeId, size);
      const order: Order = await this.sessions
        .get(accountId)
        .exchange.createMarketOrder(symbol, side, size);
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
    } catch (err) {
      error(OPEN_TRADE_ERROR(this.exchangeId, accountId, symbol), err);
      throw new OpenPositionError(
        OPEN_TRADE_ERROR(this.exchangeId, accountId, symbol)
      );
    }
  };

  createCloseOrder = async (
    account: Account,
    trade: Trade,
    ticker?: Ticker // can be preloaded in openOrder
  ): Promise<Order> => {
    await this.refreshSession(account);
    const { symbol } = trade;
    const accountId = getAccountId(account);
    try {
      if (!ticker) {
        ticker = await this.getTicker(symbol);
      }
      const { size, side } = await this.getCloseOrderOptions(
        account,
        ticker,
        trade
      );
      const cost = getOrderCost(ticker, this.exchangeId, size);
      const order = await this.sessions
        .get(accountId)
        .exchange.createMarketOrder(symbol, side, size);
      close(
        CLOSE_TRADE_SUCCESS(
          this.exchangeId,
          accountId,
          symbol,
          size,
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
