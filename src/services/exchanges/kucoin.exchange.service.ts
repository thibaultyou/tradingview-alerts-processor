import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import { Side } from '../../constants/trading.constants';
import { Trade } from '../../entities/trade.entities';
import { getAccountId } from '../../utils/account.utils';
import { debug, error } from '../logger.service';
import { SpotExchangeService } from './base/spot.exchange.service';
import {
  BALANCES_READ_ERROR,
  BALANCES_READ_SUCCESS,
  TICKER_BALANCE_READ_ERROR,
  TICKER_BALANCE_READ_SUCCESS
} from '../../messages/exchanges.messages';
import {
  BalancesFetchError,
  TickerFetchError
} from '../../errors/exchange.errors';
import { IBalance } from '../../interfaces/exchanges/common.exchange.interfaces';
import { IKuCoinBalance } from '../../interfaces/exchanges/kucoin.exchange.interfaces';
import {
  getRelativeTradeSize,
  getSpotSymbol,
  getTokensAmount,
  getTokensPrice
} from '../../utils/exchanges/common.exchange.utils';

// TODO replace by a composite exchange
export class KuCoinExchangeService extends SpotExchangeService {
  constructor() {
    super(ExchangeId.KuCoin);
  }

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
      return balances.info.data.map((b: IKuCoinBalance) => ({
        coin: b.currency,
        free: b.available,
        total: b.balance
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
    const symbol = getSpotSymbol(ticker.symbol);
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
    const { size } = trade;
    const { symbol, last } = ticker;
    const balance = await this.getTickerBalance(account, ticker);
    return {
      side: Side.Sell,
      size: size
        ? size.includes('%')
          ? getRelativeTradeSize(ticker, balance, size) // handle percentage
          : getTokensAmount(symbol, last, Number(size)) // handle absolute
        : balance // default 100%
    };
  };

  getOrderCost = (ticker: Ticker, size: number): number => {
    const { symbol, last } = ticker;
    return getTokensPrice(symbol, last, size);
  };
}
