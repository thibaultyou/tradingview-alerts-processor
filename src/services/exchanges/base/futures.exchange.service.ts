import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { PositionsFetchError } from '../../../errors/exchange.errors';
import {
  NoOpenPositionError,
  OpenPositionError
} from '../../../errors/trading.errors';
import {
  NO_CURRENT_POSITION,
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS,
  POSITION_READ_SUCCESS
} from '../../../messages/exchanges.messages';
import { OPEN_TRADE_ERROR_MAX_SIZE } from '../../../messages/trading.messages';
import { FuturesPosition } from '../../../types/exchanges.types';
import { getAccountId } from '../../../utils/account.utils';
import { getRelativeOrderSize } from '../../../utils/trading/conversion.utils';
import {
  filterPosition,
  filterPositions,
  getPositionSize
} from '../../../utils/trading/position.utils';
import { getSide } from '../../../utils/trading/side.utils';
import { debug, error, info } from '../../logger.service';
import { BaseExchangeService } from './base.exchange.service';

export abstract class FuturesExchangeService extends BaseExchangeService {
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
      throw new NoOpenPositionError(
        NO_CURRENT_POSITION(accountId, this.exchangeId, symbol)
      );
    }
    debug(POSITION_READ_SUCCESS(accountId, this.exchangeId, symbol, position));
    return position;
  };

  getTickerPositionSize = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const position = await this.getTickerPosition(account, ticker);
    return getPositionSize(position, this.exchangeId);
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
    let current = 0;
    // TODO refacto
    try {
      current = await this.getTickerPositionSize(account, ticker);
    } catch (err) {
      // silent
    }
    if (
      Math.abs(current) +
        (size.includes('%') // add the required position cost
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
