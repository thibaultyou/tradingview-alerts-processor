/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { Trade } from '../../entities/trade.entities';
import { IBinanceFuturesUSDPosition } from '../../interfaces/exchanges/binance.exchange.interfaces';
import { FuturesExchangeService } from './base/futures.exchange.service';

export class BinanceFuturesUSDMExchangeService extends FuturesExchangeService {
  constructor() {
    super(ExchangeId.BinanceFuturesUSD);
  }

  fetchPositions = async (
    instance: Exchange
  ): Promise<IBinanceFuturesUSDPosition[]> => await instance.fetchPositions();

  handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handleOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  // handleReverseOrder = async (
  //   account: Account,
  //   ticker: Ticker,
  //   trade: Trade
  // ): Promise<void> => {
  //   const { direction } = trade;
  //   const { symbol } = ticker;
  //   const accountId = getAccountId(account);
  //   const side = getSide(direction);
  //   try {
  //     const size = await this.getTickerPositionSize(account, ticker);
  //     if (
  //       size &&
  //       ((size < 0 && side === Side.Buy) || (size > 0 && side === Side.Sell))
  //     ) {
  //       info(REVERSING_TRADE(this.exchangeId, accountId, symbol));
  //       await this.closeOrder(account, trade, ticker);
  //     }
  //   } catch (err) {
  //     // ignore throw
  //   }
  // };

  // handleOverflow = async (
  //   account: Account,
  //   ticker: Ticker,
  //   trade: Trade
  // ): Promise<boolean> => {
  //   const { direction, size } = trade;
  //   const { symbol } = ticker;
  //   const accountId = getAccountId(account);
  //   try {
  //     // TODO refacto
  //     const position = (await this.getTickerPosition(
  //       account,
  //       ticker
  //     )) as IBinanceFuturesUSDPosition;
  //     const { side, notional } = position;
  //     if (
  //       position &&
  //       isSideDifferent(side as Side, direction) &&
  //       Number(size) > Math.abs(Number(notional))
  //     ) {
  //       info(TRADE_OVERFLOW(this.exchangeId, accountId, symbol));
  //       await this.closeOrder(account, trade, ticker);
  //       return true;
  //     }
  //   } catch (err) {
  //     // ignore throw
  //   }
  //   return false;
  // };
}
