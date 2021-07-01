import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import { Side } from '../../constants/trading.constants';
import { Trade } from '../../entities/trade.entities';
import { formatBinanceSpotSymbol } from '../../utils/exchanges/binance.exchange.utils';
import { getAccountId } from '../../utils/account.utils';
import { getCloseOrderSize, getTradeSide } from '../../utils/trading.utils';
import {
  OPEN_TRADE_ERROR_MAX_SIZE,
  REVERSING_TRADE_ERROR
} from '../../messages/trading.messages';
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

  getTokenAmountInDollars = (ticker: Ticker, size: number): number => {
    const { ask, bid } = ticker;
    let dollars = Number(size) * ((ask + bid) / 2);
    dollars = +dollars.toFixed(2);
    return dollars;
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
      const size = this.getTokenAmountInDollars(ticker, Number(balance.free));
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
    trade: Trade,
    orderSize: number
  ): Promise<void> => {
    const { symbol, max, direction } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    const current = await this.getTickerBalance(account, ticker);
    if (
      current + this.getTokenAmountInDollars(ticker, orderSize) >
      Number(max)
    ) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
  };

  // TODO implement ?
  handleReverseOrder = async (
    account: Account,
    ticker: Ticker,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _trade: Trade
  ): Promise<void> => {
    const accountId = getAccountId(account);
    error(REVERSING_TRADE_ERROR(this.exchangeId, accountId, ticker.symbol));
  };
}
