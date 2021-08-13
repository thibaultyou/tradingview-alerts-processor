import { Exchange, Ticker } from 'ccxt';
import {
  ExchangeId,
  EXCHANGES_NAMES,
  FTX_SUBACCOUNT_HEADER
} from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { BinanceFuturesUSDMExchangeService } from '../../services/exchanges/binance-usdm.futures.exchange.service';
import { BinanceSpotExchangeService } from '../../services/exchanges/binance.spot.exchange.service';
import { FTXExchangeService } from '../../services/exchanges/ftx.exchange.service';
import { ExchangeService } from '../../types/exchanges.types';
import { KuCoinExchangeService } from '../../services/exchanges/kucoin.exchange.service';
import { isFTXSpot } from './ftx.utils';
import { KrakenExchangeService } from '../../services/exchanges/kraken.exchange.service';

export const getExchangeName = (exchangeId: ExchangeId): string =>
  EXCHANGES_NAMES[exchangeId];

export const getExchangeOptions = (
  exchangeId: ExchangeId,
  account: Account
): Exchange['options'] => {
  const { subaccount, apiKey, secret, passphrase } = account;
  const options: Exchange['options'] = {
    apiKey: apiKey,
    secret: secret
  };
  if (exchangeId === ExchangeId.FTX && subaccount) {
    options['headers'] = { [FTX_SUBACCOUNT_HEADER]: subaccount };
  } else if (exchangeId === ExchangeId.KuCoin) {
    options['password'] = passphrase;
  }
  return options;
};

export const initExchangeService = async (
  exchangeId: ExchangeId
): Promise<ExchangeService> => {
  switch (exchangeId) {
    case ExchangeId.Binance:
      return new BinanceSpotExchangeService();
    case ExchangeId.BinanceFuturesUSD:
      return new BinanceFuturesUSDMExchangeService();
    case ExchangeId.KuCoin:
      return new KuCoinExchangeService();
    case ExchangeId.Kraken:
      return new KrakenExchangeService();
    case ExchangeId.FTX:
    default:
      const ex = new FTXExchangeService();
      await ex.init();
      return ex;
  }
};

export const isSpotExchange = (
  ticker: Ticker,
  exchangeId: ExchangeId
): boolean =>
  exchangeId === ExchangeId.Binance ||
  exchangeId === ExchangeId.KuCoin ||
  exchangeId === ExchangeId.Kraken ||
  (exchangeId === ExchangeId.FTX && isFTXSpot(ticker));
