import {
  IBinanceFuturesUSDBalance,
  IBinanceFuturesUSDPosition,
  IBinanceSpotBalance,
  IBinanceUSSpotBalance
} from '../interfaces/exchanges/binance.exchange.interfaces';
import {
  IFTXBalance,
  IFTXFuturesPosition
} from '../interfaces/exchanges/ftx.exchange.interfaces';
import { IKrakenBalance } from '../interfaces/exchanges/kraken.exchange.interfaces';
import { IKuCoinBalance } from '../interfaces/exchanges/kucoin.exchange.interfaces';
import {
  BinanceFuturesUSDMExchangeService,
  BinanceSpotExchangeService,
  BinanceUSSpotExchangeService,
  FTXExchangeService,
  KrakenExchangeService,
  KuCoinExchangeService
} from '../services/exchanges';

export type ExchangeService =
  | BinanceFuturesUSDMExchangeService
  | BinanceSpotExchangeService
  | BinanceUSSpotExchangeService
  | FTXExchangeService
  | KuCoinExchangeService
  | KrakenExchangeService;

export type FuturesPosition = IFTXFuturesPosition | IBinanceFuturesUSDPosition;

export type Balance =
  | IFTXBalance
  | IBinanceFuturesUSDBalance
  | IBinanceSpotBalance
  | IBinanceUSSpotBalance
  | IKuCoinBalance
  | IKrakenBalance;
