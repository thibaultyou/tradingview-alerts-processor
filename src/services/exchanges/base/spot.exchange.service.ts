import { Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { ISpotExchange } from '../../../interfaces/exchanges/base/spot.exchange.interface';
import { BaseExchangeService } from './base.exchange.service';

export abstract class SpotExchangeService
  extends BaseExchangeService
  implements ISpotExchange
{
  abstract getTickerBalance(account: Account, ticker: Ticker): Promise<number>;
}
