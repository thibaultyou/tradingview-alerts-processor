import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import { Side } from '../../constants/trading.constants';
import { Trade } from '../../entities/trade.entities';
import { formatBinanceSpotSymbol } from '../../utils/exchanges/binance.exchange.utils';
import { getAccountId } from '../../utils/account.utils';
import {
  getCloseOrderSize,
  getDollarsSize,
  getTradeSide
} from '../../utils/trading.utils';
import { OPEN_TRADE_ERROR_MAX_SIZE } from '../../messages/trading.messages';
import { OpenPositionError } from '../../errors/trading.errors';
import { debug, error } from '../logger.service';
import { SpotExchangeService } from './base/spot.exchange.service';
import {
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS,
  TICKER_BALANCE_READ_ERROR,
  TICKER_BALANCE_READ_SUCCESS
} from '../../messages/exchanges.messages';
import {
  ExchangeInstanceInitError,
  TickerFetchError
} from '../../errors/exchange.errors';

export class BinanceSpotExchangeService extends SpotExchangeService {
  constructor() {
    super(ExchangeId.Binance);
  }

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
      size: getCloseOrderSize(ticker, trade.size, balance)
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
    if (getDollarsSize(ticker, current) + Number(size) > Number(max)) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
  };

  handleReverseOrder = async (
    _account: Account,
    _ticker: Ticker,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _trade: Trade
  ): Promise<void> => {
    throw new Error('Not implemented');
  };

  handleOverflow = async (
    _account: Account,
    _ticker: Ticker,
    _trade: Trade
  ): Promise<boolean> => {
    throw new Error('Not implemented');
  };
}
