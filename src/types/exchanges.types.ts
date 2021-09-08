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
import { BinanceFuturesUSDMExchangeService } from '../services/exchanges/binance-usdm.futures.exchange.service';
import { BinanceSpotExchangeService } from '../services/exchanges/binance.spot.exchange.service';
import { BinanceUSSpotExchangeService } from '../services/exchanges/binanceus.spot.exchange.service';
import { FTXExchangeService } from '../services/exchanges/ftx.exchange.service';
import { KrakenExchangeService } from '../services/exchanges/kraken.exchange.service';
import { KuCoinExchangeService } from '../services/exchanges/kucoin.exchange.service';

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
