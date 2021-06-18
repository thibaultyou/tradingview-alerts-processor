import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { FuturesPosition } from '../../../interfaces/exchange.interfaces';
import { Trade } from '../../../entities/trade.entities';
import { SpotExchangeService } from './spot.exchange.service';

// FIXME I'm not proud of this, need to replace by mixin
export abstract class CompositeExchangeService extends SpotExchangeService {
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

  abstract handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;
}
