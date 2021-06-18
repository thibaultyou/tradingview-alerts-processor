import { CommonExchangeService } from './common.exchange.service';
import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { FuturesPosition } from '../../../interfaces/exchange.interfaces';
import { Trade } from '../../../entities/trade.entities';

export abstract class FuturesExchangeService extends CommonExchangeService {
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
