import { Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';

export const getTickerPrice = (
  ticker: Ticker,
  exchangeId: ExchangeId
): number => {
  const { last, bid, ask, info } = ticker;
  switch (exchangeId) {
    case ExchangeId.Binance:
    case ExchangeId.BinanceFuturesUSD:
      return info.lastPrice;
    case ExchangeId.KuCoin:
    case ExchangeId.Kraken:
      return last;
    case ExchangeId.FTX:
    default:
      return (bid + ask) / 2;
  }
};
