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
import {
  TRADE_CALCULATED_SIZE_ERROR,
  TRADE_ERROR_SIZE
} from '../../messages/trading.messages';
import { OrderSizeError } from '../../errors/trading.errors';
import { error } from '../../services/logger.service';
import { ConversionError } from '../../errors/exchange.errors';

export const formatExchange = (id: ExchangeId): string => EXCHANGES_NAMES[id];

export const getExchangeOptions = (
  exchangeId: ExchangeId,
  account: Account
): Exchange['options'] => {
  const { subaccount, apiKey, secret, passphrase } = account;
  const options: Exchange['options'] = {
    apiKey: apiKey,
    secret: secret
  };
  // FIXME refacto / remove specific configs
  if (exchangeId === ExchangeId.FTX && subaccount) {
    options['headers'] = { [FTX_SUBACCOUNT_HEADER]: subaccount };
  } else if (exchangeId === ExchangeId.KuCoin) {
    options['password'] = passphrase;
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
    case ExchangeId.KuCoin:
      return new KuCoinExchangeService();
    case ExchangeId.FTX:
    default:
      return new FTXExchangeService();
  }
};

export const getSpotSymbol = (symbol: string): string => symbol.split('/')[0];

export const getSpotQuote = (symbol: string): string => symbol.split('/')[1];

export const getRelativeTradeSize = (
  ticker: Ticker,
  balance: number,
  size: string
): number => {
  const percent = Number(size.replace(/%/g, ''));
  if (percent <= 0 || percent > 100) {
    error(TRADE_ERROR_SIZE(size));
    throw new OrderSizeError(TRADE_ERROR_SIZE(size));
  }
  // debug(TRADE_CALCULATED_SIZE(symbol, tokens, dollars));
  return (balance * percent) / 100;
};

export const getTokensAmount = (
  symbol: string,
  price: number,
  dollars: number
): number => {
  const tokens = dollars / price;
  if (isNaN(tokens)) {
    error(TRADE_CALCULATED_SIZE_ERROR(symbol));
    throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
  }
  // debug(TRADE_CALCULATED_SIZE(symbol, tokens, dollars));
  return tokens;
};

export const getTokensPrice = (
  symbol: string,
  price: number,
  tokens: number
): number => {
  const size = price * tokens;
  if (isNaN(size)) {
    error(TRADE_CALCULATED_SIZE_ERROR(symbol));
    throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
  }
  // debug(TRADE_CALCULATED_SIZE(symbol, tokens, size));
  return size;
};
