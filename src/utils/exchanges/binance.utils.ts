import { Exchange, Ticker } from 'ccxt';
import { Side } from '../../constants/trade.constants';
import { Account } from '../../entities/account.entities';
import { Trade } from '../../entities/trade.entities';
import { PositionsFetchError } from '../../errors/exchange.errors';
import { IBinanceFuturesUSDPosition } from '../../interfaces/exchange.interfaces';
import { IOrderOptions } from '../../interfaces/trade.interface';
import {
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS
} from '../../messages/exchange.messages';
import { OPEN_TRADE_NO_CURRENT_OPENED_POSITION } from '../../messages/trade.messages';
import {
  getAccountBalances,
  getAccountTickerBalance
} from '../../services/account.service';
import { debug, error } from '../../services/logger.service';
import { getAccountId } from '../account.utils';
import { getSizeInDollars, getTradeSide } from '../trade.utils';

export const formatBinanceSpotSymbol = (symbol: string): string =>
  symbol.split('/')[0];

export const formatBinanceFuturesSymbol = (symbol: string): string =>
  symbol.replace('/', '');

export const updateBinanceSpotCloseOrderOptions = async (
  instance: Exchange,
  account: Account,
  symbol: string,
  options: IOrderOptions
): Promise<void> => {
  const balances = await getAccountBalances(instance, account);
  options.size = Number(
    balances.filter((b) => b.coin === formatBinanceSpotSymbol(symbol)).pop()
      .free
  );
};

export const updateBinanceFuturesUSDCloseOrderOptions = async (
  instance: Exchange,
  symbol: string,
  options: IOrderOptions
): Promise<void> => {
  const positions: IBinanceFuturesUSDPosition[] =
    await instance.fetchPositions();
  const position = positions
    .filter((p) => p.symbol === formatBinanceFuturesSymbol(symbol))
    .pop();

  const size = Number(position.positionAmt);

  if (position) {
    options.size = Math.abs(size);
    options.side = size > 0 ? Side.Sell : Side.Buy;
  }
};

export const getBinanceSpotTickerCurrentBalance = async (
  instance: Exchange,
  account: Account,
  ticker: Ticker,
  symbol: string
): Promise<number> => {
  const { exchange } = account;
  const id = getAccountId(account);

  // TODO catch err
  const balance = await getAccountTickerBalance(
    instance,
    account,
    formatBinanceSpotSymbol(symbol)
  );

  if (balance) {
    return getSizeInDollars(exchange, ticker, balance.total);
  } else {
    debug(OPEN_TRADE_NO_CURRENT_OPENED_POSITION(id, exchange, symbol));
  }
};

export const getBinanceFuturesUSDPositions = async (
  instance: Exchange,
  account: Account
): Promise<IBinanceFuturesUSDPosition[]> => {
  const id = getAccountId(account);
  const { exchange } = account;
  try {
    const positions = await instance.fetchPositions();
    debug(POSITIONS_READ_SUCCESS(id, exchange));
    return positions;
  } catch (err) {
    error(POSITIONS_READ_ERROR(id, exchange), err);
    throw new PositionsFetchError(
      POSITIONS_READ_ERROR(id, exchange, err.message)
    );
  }
};

export const getBinanceFuturesUSDTickerPosition = async (
  instance: Exchange,
  account: Account,
  symbol: string
): Promise<IBinanceFuturesUSDPosition> => {
  const positions = await getBinanceFuturesUSDPositions(instance, account);
  return positions
    .filter((p) => p.symbol === formatBinanceFuturesSymbol(symbol))
    .pop();
};

export const getBinanceFuturesReversePositionStatus = async (
  instance: Exchange,
  account: Account,
  trade: Trade
): Promise<boolean> => {
  const { direction, symbol } = trade;
  const side = getTradeSide(direction);
  const position = await getBinanceFuturesUSDTickerPosition(
    instance,
    account,
    symbol
  );
  const size = Number(position.notional);
  if (
    size &&
    ((size < 0 && side === Side.Buy) || (size > 0 && side === Side.Sell))
  ) {
    return true;
  }
};

export const getBinanceFuturesUSDTTickerCurrentPositionSize = async (
  instance: Exchange,
  account: Account,
  ticker: Ticker,
  symbol: string
): Promise<number> => {
  const { exchange } = account;
  const id = getAccountId(account);
  // TODO catch err
  const position = await getBinanceFuturesUSDTickerPosition(
    instance,
    account,
    symbol
  );
  if (position) {
    return getSizeInDollars(exchange, ticker, position.notional);
  } else {
    debug(OPEN_TRADE_NO_CURRENT_OPENED_POSITION(id, exchange, symbol));
  }
};
