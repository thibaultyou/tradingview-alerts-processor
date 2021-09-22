import { Side } from '../../constants/trading.constants';

// we have to do this mapping for ccxt order, disgusting right ?
export const getSide = (side: Side): Side =>
  side === Side.Close
    ? Side.Close
    : side === Side.Sell || side === Side.Short
    ? Side.Sell
    : Side.Buy;

// TODO add isSideBuy

// TODO add isSideSell

export const getInvertedSide = (side: Side): 'buy' | 'sell' =>
  side === Side.Sell || side === Side.Short ? Side.Buy : Side.Sell;

export const isSideDifferent = (first: Side, second: Side): boolean =>
  getSide(first) !== getSide(second);
