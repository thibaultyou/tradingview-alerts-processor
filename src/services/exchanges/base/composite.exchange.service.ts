import { Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import {
  BalanceMissingError,
  TickerFetchError
} from '../../../errors/exchange.errors';
import {
  TICKER_BALANCE_READ_SUCCESS,
  TICKER_BALANCE_READ_ERROR,
  TICKER_BALANCE_MISSING_ERROR
} from '../../../messages/exchanges.messages';
import { getAccountId } from '../../../utils/account.utils';
import { getSpotSymbol } from '../../../utils/trading/symbol.utils';
import { debug, error } from '../../logger.service';
import { FuturesExchangeService } from './futures.exchange.service';

// FIXME can be replaced by a mixin
export abstract class CompositeExchangeService extends FuturesExchangeService {
  getTickerBalance = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const accountId = getAccountId(account);
    const symbol = getSpotSymbol(ticker.symbol);
    try {
      const balances = await this.getBalances(account);
      // TODO refacto (see Spot)
      const balance = balances.filter((b) => b.coin === symbol).pop();
      if (!balance) {
        throw new BalanceMissingError();
      }
      const size = Number(balance.free);
      debug(
        TICKER_BALANCE_READ_SUCCESS(this.exchangeId, accountId, symbol, balance)
      );
      return size;
    } catch (err) {
      if (err instanceof BalanceMissingError) {
        error(TICKER_BALANCE_MISSING_ERROR(this.exchangeId, accountId, symbol));
        throw new TickerFetchError(
          TICKER_BALANCE_MISSING_ERROR(this.exchangeId, accountId, symbol)
        );
      }
      error(TICKER_BALANCE_READ_ERROR(this.exchangeId, accountId, symbol, err));
      throw new TickerFetchError(
        TICKER_BALANCE_READ_ERROR(this.exchangeId, accountId, symbol, err)
      );
    }
  };
  // above declaration is the same as SpotExchangeService since I'm not playing with mixins for now
}
