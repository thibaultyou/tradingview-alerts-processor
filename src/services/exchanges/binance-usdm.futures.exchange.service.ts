/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { Trade } from '../../entities/trade.entities';
import { IBinanceFuturesUSDPosition } from '../../interfaces/exchanges/binance.exchange.interfaces';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import {
  getRelativeOrderSize,
  getTokensAmount
} from '../../utils/trading/conversion.utils';
import { FuturesExchangeService } from './base/futures.exchange.service';

export class BinanceFuturesUSDMExchangeService extends FuturesExchangeService {
  constructor() {
    super(ExchangeId.BinanceFuturesUSD);
  }

  fetchPositions = async (
    instance: Exchange
  ): Promise<IBinanceFuturesUSDPosition[]> => await instance.fetchPositions();

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    const { size } = trade;
    const { symbol, info } = ticker;
    const { lastPrice } = info;
    const { contracts, notional, side } = (await this.getTickerPosition(
      account,
      ticker
    )) as IBinanceFuturesUSDPosition;

    // TODO refacto
    let orderSize = 0;
    if (size && size.includes('%')) {
      orderSize = getRelativeOrderSize(contracts, size);
    } else if (!size || Number(size) > notional) {
      orderSize = contracts;
    } else {
      orderSize = getTokensAmount(symbol, lastPrice, Number(size));
    }

    return {
      size: orderSize,
      side: side === 'long' ? 'sell' : 'buy'
    };
  };

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
