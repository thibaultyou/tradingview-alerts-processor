import { Account } from '../../entities/account.entities';
import { debug, error } from '../../services/logger.service';
import { Exchange, Ticker } from 'ccxt';
import { FTX_SUBACCOUNT_HEADER } from '../../constants/exchanges.constants';
import {
  getAccountBalances,
  getAccountTickerBalance
} from '../../services/account.service';
import { getAccountId } from '../account.utils';
import {
  getInvertedTradeSide,
  getSizeInDollars,
  getTradeSide
} from '../trade.utils';
import { IFTXFuturesPosition } from '../../interfaces/exchange.interfaces';
import { IOrderOptions } from '../../interfaces/trade.interface';
import { OPEN_TRADE_NO_CURRENT_OPENED_POSITION } from '../../messages/trade.messages';
import {
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS
} from '../../messages/exchange.messages';
import { PositionsFetchError } from '../../errors/exchange.errors';
import { Side } from '../../constants/trade.constants';
import { Trade } from '../../entities/trade.entities';

export const updateFTXSpotCloseOrderOptions = async (
  instance: Exchange,
  account: Account,
  symbol: string,
  options: IOrderOptions
): Promise<void> => {
  const balances = await getAccountBalances(instance, account);
  const balance = balances.filter((b) => b.coin === symbol).pop();
  if (balance) {
    options.size = Number(balance.free);
  }
};

export const updateFTXFuturesCloseOrderOptions = async (
  instance: Exchange,
  symbol: string,
  options: IOrderOptions
): Promise<void> => {
  const positions: IFTXFuturesPosition[] = await instance.fetchPositions();
  const position = positions.filter((p) => p.future === symbol).pop();
  if (position) {
    options.size = Number(position.size);
    options.side = getInvertedTradeSide(position.side as Side);
  }
};

export const updateFTXExchangeOptions = (
  options: Exchange['options'],
  account: Account
): void => {
  const { subaccount } = account;
  options['headers'] = { [FTX_SUBACCOUNT_HEADER]: subaccount };
};

export const getFTXSpotTickerCurrentBalance = async (
  instance: Exchange,
  account: Account,
  ticker: Ticker,
  symbol: string
): Promise<number> => {
  const { exchange } = account;
  const id = getAccountId(account);
  const balance = await getAccountTickerBalance(instance, account, symbol);
  if (balance) {
    return getSizeInDollars(exchange, ticker, balance.total);
  } else {
    debug(OPEN_TRADE_NO_CURRENT_OPENED_POSITION(id, exchange, symbol));
  }
};

export const getFTXFuturesTickerCurrentPositionSize = async (
  instance: Exchange,
  account: Account,
  ticker: Ticker,
  symbol: string
): Promise<number> => {
  const { exchange } = account;
  const id = getAccountId(account);
  // TODO catch err
  const position = await getFTXFuturesTickerPosition(instance, account, symbol);
  if (position) {
    return getSizeInDollars(exchange, ticker, position.size);
  } else {
    debug(OPEN_TRADE_NO_CURRENT_OPENED_POSITION(id, exchange, symbol));
  }
};

export const getFTXFuturesPositions = async (
  instance: Exchange,
  account: Account
): Promise<IFTXFuturesPosition[]> => {
  const id = getAccountId(account);
  const { exchange } = account;
  try {
    const account = await instance.privateGetAccount();
    const positions = account.result.positions;
    debug(POSITIONS_READ_SUCCESS(id, exchange));
    return positions;
  } catch (err) {
    error(POSITIONS_READ_ERROR(id, exchange), err);
    throw new PositionsFetchError(
      POSITIONS_READ_ERROR(id, exchange, err.message)
    );
  }
};

export const getFTXFuturesTickerPosition = async (
  instance: Exchange,
  account: Account,
  symbol: string
): Promise<IFTXFuturesPosition> => {
  const positions = await getFTXFuturesPositions(instance, account);
  return positions.filter((p) => p.future === symbol).pop();
};

export const getFTXFuturesReversePositionStatus = async (
  instance: Exchange,
  account: Account,
  trade: Trade
): Promise<boolean> => {
  const { direction, symbol } = trade;
  const side = getTradeSide(direction);
  const position = await getFTXFuturesTickerPosition(instance, account, symbol);
  if (Number(position.size) && position.side !== side) {
    return true;
  }
};
