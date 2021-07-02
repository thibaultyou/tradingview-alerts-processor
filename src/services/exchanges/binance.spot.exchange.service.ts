import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import { Side } from '../../constants/trading.constants';
import { Trade } from '../../entities/trade.entities';
import {
  formatBinanceSpotSymbol,
  getBinanceSpotQuoteCurrency
} from '../../utils/exchanges/binance.exchange.utils';
import { getAccountId } from '../../utils/account.utils';
import { getTradeSide } from '../../utils/trading.utils';
import {
  OPEN_TRADE_ERROR_MAX_SIZE,
  TRADE_CALCULATED_OPEN_SIZE,
  TRADE_CALCULATED_SIZE,
  TRADE_CALCULATED_SIZE_ERROR,
  TRADE_ERROR_SIZE
} from '../../messages/trading.messages';
import { OpenPositionError, OrderSizeError } from '../../errors/trading.errors';
import { debug, error } from '../logger.service';
import { SpotExchangeService } from './base/spot.exchange.service';
import {
  AVAILABLE_FUNDS,
  BALANCES_READ_ERROR,
  BALANCES_READ_SUCCESS,
  TICKER_BALANCE_READ_ERROR,
  TICKER_BALANCE_READ_SUCCESS
} from '../../messages/exchanges.messages';
import {
  BalancesFetchError,
  ConversionError,
  TickerFetchError
} from '../../errors/exchange.errors';
import { IBalance } from '../../interfaces/exchanges/common.exchange.interfaces';
import { IBinanceSpotBalance } from '../../interfaces/exchanges/binance.exchange.interfaces';

export class BinanceSpotExchangeService extends SpotExchangeService {
  constructor() {
    super(ExchangeId.Binance);
  }

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
      return balances.info.balances
        .filter((b: IBinanceSpotBalance) => Number(b.free))
        .map((b: IBinanceSpotBalance) => ({
          coin: b.asset,
          free: b.free,
          total: Number(b.free) + Number(b.locked)
        }));
    } catch (err) {
      error(BALANCES_READ_ERROR(this.exchangeId, accountId), err);
      throw new BalancesFetchError(
        BALANCES_READ_ERROR(this.exchangeId, accountId, err.message)
      );
    }
  };

  getTickerBalance = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const accountId = getAccountId(account);
    const symbol = formatBinanceSpotSymbol(ticker.symbol);
    try {
      const balances = await this.getBalances(account);
      const balance = balances.filter((b) => b.coin === symbol).pop();
      const size = Number(balance.free);
      debug(
        TICKER_BALANCE_READ_SUCCESS(this.exchangeId, accountId, symbol, balance)
      );
      return size;
    } catch (err) {
      error(TICKER_BALANCE_READ_ERROR(this.exchangeId, accountId, symbol, err));
      throw new TickerFetchError(
        TICKER_BALANCE_READ_ERROR(this.exchangeId, accountId, symbol, err)
      );
    }
  };

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    const balance = await this.getTickerBalance(account, ticker);
    return {
      side: Side.Sell,
      size: this.getCloseOrderSize(ticker, trade.size, balance)
    };
  };

  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void> => {
    const { symbol, max, direction, size } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    const current = await this.getTickerBalance(account, ticker);
    if (this.getTokensPrice(ticker, current) + Number(size) > Number(max)) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
  };

  getTokensAmount = (ticker: Ticker, dollars: number): number => {
    const { info, symbol } = ticker;
    const tokens = dollars / Number(info.lastPrice);
    if (isNaN(tokens)) {
      error(TRADE_CALCULATED_SIZE_ERROR(symbol));
      throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
    }
    debug(TRADE_CALCULATED_SIZE(symbol, tokens, dollars));
    return tokens;
  };

  getTokensPrice = (ticker: Ticker, tokens: number): number => {
    const { info, symbol } = ticker;
    const price = Number(info.lastPrice) * tokens;
    if (isNaN(price)) {
      error(TRADE_CALCULATED_SIZE_ERROR(symbol));
      throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
    }
    debug(TRADE_CALCULATED_SIZE(symbol, tokens, price));
    return price;
  };

  // TODO implement
  handleReverseOrder = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _account: Account,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ticker: Ticker,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _trade: Trade
  ): Promise<void> => {
    throw new Error('Not implemented');
  };

  // TODO implement
  handleOverflow = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _account: Account,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ticker: Ticker,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _trade: Trade
  ): Promise<boolean> => {
    throw new Error('Not implemented');
  };

  getOpenOrderSize = async (
    account: Account,
    ticker: Ticker,
    size: string
  ): Promise<number> => {
    const { symbol } = ticker;
    if (size.includes('%')) {
      const accountId = getAccountId(account);
      try {
        const percent = Number(size.replace(/\D/g, ''));
        if (percent <= 0 || percent > 100) {
          error(TRADE_ERROR_SIZE(size));
          throw new OrderSizeError(TRADE_ERROR_SIZE(size));
        }
        const balances = await this.getBalances(account);
        const quoteCurrency = getBinanceSpotQuoteCurrency(ticker.symbol);
        const balance = balances.filter((b) => b.coin === quoteCurrency).pop();
        const availableFunds = Number(balance.free);
        // TODO handle NaN
        debug(
          AVAILABLE_FUNDS(
            accountId,
            this.exchangeId,
            quoteCurrency,
            availableFunds
          )
        );
        const relativeSize = (availableFunds * percent) / 100;
        debug(TRADE_CALCULATED_OPEN_SIZE(relativeSize.toFixed(2), size));
        return relativeSize;
      } catch (err) {
        error(TRADE_CALCULATED_SIZE_ERROR(symbol, err));
        throw new OrderSizeError(TRADE_CALCULATED_SIZE_ERROR(symbol, err));
      }
    } else {
      return Number(size);
    }
  };
}
