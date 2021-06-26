import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { BalancesFetchError } from '../../../errors/exchange.errors';
import {
  IBalance,
  ISpotExchange
} from '../../../interfaces/exchanges/common.exchange.interfaces';
import {
  BALANCES_READ_ERROR,
  BALANCES_READ_SUCCESS
} from '../../../messages/exchanges.messages';
import { getAccountId } from '../../../utils/account.utils';
import { formatBalances } from '../../../utils/exchanges/common.exchange.utils';
import { debug, error } from '../../logger.service';
import { CommonExchangeService } from './common.exchange.service';

export abstract class SpotExchangeService
  extends CommonExchangeService
  implements ISpotExchange
{
  abstract getTickerBalance(account: Account, ticker: Ticker): Promise<number>;

  getBalances = async (
    account: Account,
    instance?: Exchange
  ): Promise<IBalance[]> => {
    const accountId = getAccountId(account);
    try {
      if (!instance) {
        instance = (await this.refreshSession(account)).exchange;
      }
      // we don't use fetchBalance() because coin is not returned
      const balances = await instance.fetch_balance();
      debug(BALANCES_READ_SUCCESS(this.exchangeId, accountId));
      return formatBalances(this.exchangeId, balances);
    } catch (err) {
      error(BALANCES_READ_ERROR(this.exchangeId, accountId), err);
      throw new BalancesFetchError(
        BALANCES_READ_ERROR(this.exchangeId, accountId, err.message)
      );
    }
  };
}
