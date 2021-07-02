import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { IFuturesExchange } from '../../../interfaces/exchanges/base/futures.exchange.interface';
import { FuturesPosition } from '../../../types/exchanges.types';
import { BaseExchangeService } from './base.exchange.service';

export abstract class FuturesExchangeService
  extends BaseExchangeService
  implements IFuturesExchange
{
  abstract getPositions(
    account: Account,
    instance?: Exchange
  ): Promise<FuturesPosition[]>;

  abstract getTickerPosition(
    account: Account,
    ticker: Ticker
  ): Promise<FuturesPosition>;

  abstract getTickerPositionSize(
    account: Account,
    ticker: Ticker
  ): Promise<number>;
}
