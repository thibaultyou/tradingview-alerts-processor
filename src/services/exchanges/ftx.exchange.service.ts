import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { getAccountId } from '../../utils/account.utils';
import { Exchange, Ticker } from 'ccxt';
import { Side } from '../../constants/trading.constants';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import { debug, error } from '../logger.service';
import { Trade } from '../../entities/trade.entities';
import { getFTXBaseSymbol, isFTXSpot } from '../../utils/exchanges/ftx.utils';
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
import { FTXExchangeWSService } from './ws/ftx.ws.service';
import { TICKER_READ_ERROR, TICKER_READ_SUCCESS } from '../../messages/exchanges.messages';
import { TickerFetchError } from '../../errors/exchange.errors';
import { getTickerPrice } from '../../utils/trading/ticker.utils';

export class FTXExchangeService extends CompositeExchangeService {
  ws: FTXExchangeWSService;

  constructor() {
    super(ExchangeId.FTX);
  }

  init = async () => {
    this.ws = await FTXExchangeWSService.init()
  }

  getTicker = async (symbol: string): Promise<Ticker> => {
    try {
      let ticker: Ticker;
      const base = getFTXBaseSymbol(symbol)
      if (!this.ws.tickers[base]) {
        this.ws.addTicker(symbol);
        ticker = await this.defaultExchange.fetchTicker(symbol);
      } else {
        ticker = {symbol, ...this.ws.tickers[base]} as unknown as Ticker
      }
      debug(TICKER_READ_SUCCESS(this.exchangeId, symbol, ticker));
      return ticker;
    } catch (err) {
      console.log(err)
      error(TICKER_READ_ERROR(this.exchangeId, symbol), err);
      throw new TickerFetchError(
        TICKER_READ_ERROR(this.exchangeId, symbol, err.message)
      );
    }
  };

  fetchPositions = async (instance: Exchange): Promise<IFTXFuturesPosition[]> =>
    (await instance.privateGetAccount()).result.positions;

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    const { size } = trade;
    const { symbol } = ticker;
    const price = getTickerPrice(ticker, this.exchangeId)
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
    trade: Trade,
    balance: number
  ): Promise<void> => {
    const { max, direction, size } = trade;
    const { symbol } = ticker;
    const accountId = getAccountId(account);
    const side = getSide(direction);
    // we add a check since FTX is a composite exchange
    let current = 0;
    try {
      if (isFTXSpot(ticker)) {
        const tickerBalance = await this.getTickerBalance(account, ticker);
        current = getOrderCost(ticker, this.exchangeId, tickerBalance);
      } else {
        current = await this.getTickerPositionSize(account, ticker);
      }
    } catch (err) {
      // silent
    }
    if (
      Math.abs(current) +
        (size.includes('%')
          ? getRelativeOrderSize(balance, size)
          : Number(size)) >
      Number(max)
    ) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
  };

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
