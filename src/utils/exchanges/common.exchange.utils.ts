import { Exchange } from 'ccxt';
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

export const formatExchange = (id: ExchangeId): string => EXCHANGES_NAMES[id];

export const getExchangeOptions = (
  exchangeId: ExchangeId,
  account: Account
): Exchange['options'] => {
  const { subaccount, apiKey, secret } = account;
  const options: Exchange['options'] = {
    apiKey: apiKey,
    secret: secret
  };
  // FIXME refacto / rmeove specific configs
  if (exchangeId === ExchangeId.FTX && subaccount) {
    options['headers'] = { [FTX_SUBACCOUNT_HEADER]: subaccount };
  }
  return options;
};

export const initExchangeService = (
  exchangeId: ExchangeId
): ExchangeService => {
  switch (exchangeId) {
    case ExchangeId.Binance:
      return new BinanceSpotExchangeService();
    case ExchangeId.BinanceFuturesUSD:
      return new BinanceFuturesUSDMExchangeService();
    case ExchangeId.FTX:
    default:
      return new FTXExchangeService();
  }
};
