/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { getAccountId } from '../../utils/account.utils';
import { Exchange, Ticker } from 'ccxt';
import { Side } from '../../constants/trading.constants';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import { error } from '../logger.service';
import { Trade } from '../../entities/trade.entities';
import { isFTXSpot } from '../../utils/exchanges/ftx.utils';
import { OPEN_TRADE_ERROR_MAX_SIZE } from '../../messages/trading.messages';
import { OpenPositionError } from '../../errors/trading.errors';
import { CompositeExchangeService } from './base/composite.exchange.service';
import { IFTXFuturesPosition } from '../../interfaces/exchanges/ftx.exchange.interfaces';
import {
  getTokensAmount,
  getOrderCost,
  getRelativeOrderSize
} from '../../utils/trading/conversion.utils';
import { getInvertedSide, getSide } from '../../utils/trading/side.utils';

export class FTXExchangeService extends CompositeExchangeService {
  constructor() {
    super(ExchangeId.FTX);
  }

  fetchPositions = async (instance: Exchange): Promise<IFTXFuturesPosition[]> =>
    (await instance.privateGetAccount()).result.positions;

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    const { size } = trade;
    const { symbol, info } = ticker;
    const { price } = info;
    // we add a check since FTX is a composite exchange
    if (isFTXSpot(ticker)) {
      const balance = await this.getTickerBalance(account, ticker);
      return {
        side: Side.Sell,
        size: size
          ? size.includes('%')
            ? getRelativeOrderSize(balance, size) // handle percentage
            : getTokensAmount(symbol, price, Number(size)) // handle absolute
          : balance // default 100%
      };
    }
    const position = (await this.getTickerPosition(
      account,
      ticker
    )) as IFTXFuturesPosition;
    const contracts = Number(position.size);
    if (position) {
      // TODO refacto
      let orderSize = 0;
      if (size && size.includes('%')) {
        orderSize = getRelativeOrderSize(contracts, size);
      } else if (!size || Number(size) > price) {
        orderSize = contracts;
      } else {
        orderSize = getTokensAmount(symbol, price, Number(size));
      }
      return {
        size: orderSize,
        side: getInvertedSide(position.side as Side)
      };
    }
  };

  // TODO refacto
  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void> => {
    const { max, direction, size } = trade;
    const { symbol } = ticker;
    const accountId = getAccountId(account);
    const side = getSide(direction);
    // we add a check since FTX is a composite exchange
    let current = 0;
    if (isFTXSpot(ticker)) {
      const balance = await this.getTickerBalance(account, ticker);
      current = getOrderCost(ticker, this.exchangeId, balance);
    } else {
      current = await this.getTickerPositionSize(account, ticker);
    }
    if (Math.abs(current) + Number(size) > Number(max)) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
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
  //   const accountId = getAccountId(account);
  //   try {
  //     const position = (await this.getTickerPosition(
  //       account,
  //       ticker
  //     )) as IFTXFuturesPosition;
  //     if (position && isSideDifferent(position.side as Side, direction)) {
  //       info(REVERSING_TRADE(this.exchangeId, accountId, ticker.symbol));
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
  //   const { symbol, info } = ticker;
  //   const accountId = getAccountId(account);
  //   try {
  //     if (isFTXSpot(ticker)) {
  //       const balance = await this.getTickerBalance(account, ticker);
  //       const cost = getOrderCost(ticker, this.exchangeId, balance);
  //       if (cost && getSide(direction) === Side.Sell && cost < Number(size)) {
  //         info(TRADE_OVERFLOW(this.exchangeId, accountId, symbol));
  //         await this.closeOrder(
  //           account,
  //           { ...trade, size: balance.toString() },
  //           ticker
  //         );
  //         return true;
  //       }
  //     } else {
  //       const position = (await this.getTickerPosition(
  //         account,
  //         ticker
  //       )) as IFTXFuturesPosition;
  //       const { side, cost } = position;
  //       if (
  //         position &&
  //         isSideDifferent(side as Side, direction) &&
  //         Number(size) > Math.abs(Number(cost))
  //       ) {
  //         info(TRADE_OVERFLOW(this.exchangeId, accountId, symbol));
  //         await this.closeOrder(account, trade, ticker);
  //         return true;
  //       }
  //     }
  //   } catch (err) {
  //     // ignore throw
  //   }
  //   return false;
  // };
}
