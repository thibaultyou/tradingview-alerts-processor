import { CommonExchangeService } from './common.exchange.service';
import { Ticker } from 'ccxt';
import { Account } from '../../entities/account.entities';
import { FuturesPosition } from '../../interfaces/exchange.interfaces';

export abstract class FuturesExchangeService extends CommonExchangeService {
  abstract getPositions(account: Account): Promise<FuturesPosition[]>;

  abstract getTickerPosition(
    account: Account,
    ticker: Ticker
  ): Promise<FuturesPosition>;

  abstract getTickerPositionSize(
    account: Account,
    ticker: Ticker
  ): Promise<number>;
}
