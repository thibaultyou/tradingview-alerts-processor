import { Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { IBinanceFuturesUSDPosition } from '../../interfaces/exchanges/binance.exchange.interfaces';
import { IFTXFuturesPosition } from '../../interfaces/exchanges/ftx.exchange.interfaces';
import { FuturesPosition } from '../../types/exchanges.types';

export const getPositionSize = (
  position: FuturesPosition,
  exchangeId: ExchangeId
): number => {
  const size =
    exchangeId === ExchangeId.BinanceFuturesUSD
      ? (position as IBinanceFuturesUSDPosition).notional
      : (position as IFTXFuturesPosition).cost;
  return Number(size);
};

export const filterPosition = (
  positions: FuturesPosition[],
  exchangeId: ExchangeId,
  ticker: Ticker
): FuturesPosition => {
  const { symbol } = ticker;
  const predicate =
    exchangeId === ExchangeId.BinanceFuturesUSD
      ? (p: IBinanceFuturesUSDPosition) => p.symbol === symbol
      : (p: IFTXFuturesPosition) => p.future === symbol;
  return positions.filter(predicate).pop();
};

export const filterPositions = (
  positions: FuturesPosition[],
  exchangeId: ExchangeId
): FuturesPosition[] => {
  const predicate =
    exchangeId === ExchangeId.BinanceFuturesUSD
      ? (p: IBinanceFuturesUSDPosition) => Number(p.notional)
      : (p: IFTXFuturesPosition) => Number(p.size);
  return positions.filter(predicate);
};
