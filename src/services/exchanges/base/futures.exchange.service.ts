import { Exchange, Ticker } from 'ccxt';
import { TradingMode } from '../../../constants/trading.constants';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { PositionsFetchError } from '../../../errors/exchange.errors';
import { OpenPositionError } from '../../../errors/trading.errors';
import { IFuturesExchange } from '../../../interfaces/exchanges/base/futures.exchange.interfaces';
import {
  NO_CURRENT_POSITION,
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS,
  POSITION_READ_SUCCESS
} from '../../../messages/exchanges.messages';
import { OPEN_TRADE_ERROR_MAX_SIZE } from '../../../messages/trading.messages';
import { FuturesPosition } from '../../../types/exchanges.types';
import { getAccountId } from '../../../utils/account.utils';
import {
  getRelativeOrderSize,
  getTokensAmount
} from '../../../utils/trading/conversion.utils';
import {
  filterPosition,
  filterPositions,
  getPositionSize
} from '../../../utils/trading/position.utils';
import { getSide, getInvertedSide } from '../../../utils/trading/side.utils';
import { debug, error, info } from '../../logger.service';
import { BaseExchangeService } from './base.exchange.service';
import { getTickerPrice } from '../../../utils/trading/ticker.utils';
import { IOrderOptions } from '../../../interfaces/trading.interfaces';

export abstract class FuturesExchangeService
  extends BaseExchangeService
  implements IFuturesExchange
{
  abstract handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;

  abstract handleOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  abstract fetchPositions(instance: Exchange): Promise<FuturesPosition[]>;

  getPositions = async (account: Account): Promise<FuturesPosition[]> => {
    const accountId = getAccountId(account);
    try {
      const instance = this.sessions.get(accountId).exchange;
      const positions = filterPositions(
        await this.fetchPositions(instance),
        this.exchangeId
      );
      debug(POSITIONS_READ_SUCCESS(accountId, this.exchangeId, positions));
      return positions;
    } catch (err) {
      error(POSITIONS_READ_ERROR(accountId, this.exchangeId), err);
      throw new PositionsFetchError(
        POSITIONS_READ_ERROR(accountId, this.exchangeId, err.message)
      );
    }
  };

  getTickerPosition = async (
    account: Account,
    ticker: Ticker
  ): Promise<FuturesPosition> => {
    const { symbol } = ticker;
    const accountId = getAccountId(account);
    const positions = await this.getPositions(account);
    const position = filterPosition(positions, this.exchangeId, ticker);
    if (!position) {
      info(NO_CURRENT_POSITION(accountId, this.exchangeId, symbol));
      // throw new NoOpenPositionError(
      //   NO_CURRENT_POSITION(accountId, this.exchangeId, symbol)
      // );
    } else {
      debug(
        POSITION_READ_SUCCESS(accountId, this.exchangeId, symbol, position)
      );
    }
    return position;
  };

  getTickerPositionSize = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const position = await this.getTickerPosition(account, ticker);
    return position ? getPositionSize(position, this.exchangeId) : 0;
  };

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    const { size, direction } = trade;
    const { symbol } = ticker;
    const price = getTickerPrice(ticker, this.exchangeId);
    const position = await this.getTickerPosition(account, ticker);
    const current = getPositionSize(position, this.exchangeId);

    let orderSize = 0;
    if (size && size.includes('%')) {
      orderSize = getRelativeOrderSize(current, size); // relative
    } else if (!size || Number(size) > current) {
      orderSize = current; // 100%
    } else {
      orderSize = Number(size); // absolute
    }

    return {
      size: getTokensAmount(symbol, price, orderSize),
      side: getInvertedSide(direction) as 'sell' | 'buy'
    };
  };

  handleOrderModes = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    const { mode } = trade;
    if (mode === TradingMode.Reverse) {
      await this.handleReverseOrder(account, ticker, trade);
    } else if (mode === TradingMode.Overflow) {
      // on overflow we only close position so we don't need to open a new trade
      return !(await this.handleOverflow(account, ticker, trade));
    }
    return true;
  };

  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade,
    balance: number
  ): Promise<void> => {
    const { symbol, max, direction, size } = trade;
    const accountId = getAccountId(account);
    const side = getSide(direction);
    const current = await this.getTickerPositionSize(account, ticker);
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
}
