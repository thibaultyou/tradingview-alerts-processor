import { CommonExchangeService } from './common.exchange.service';
import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { FuturesPosition } from '../../../types/exchanges.types';
import { IFuturesExchange } from '../../../interfaces/exchanges/common.exchange.interfaces';

export abstract class FuturesExchangeService
  extends CommonExchangeService
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
