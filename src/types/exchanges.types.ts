import { IBinanceFuturesUSDPosition } from '../interfaces/exchanges/binance.exchange.interfaces';
import { IFTXFuturesPosition } from '../interfaces/exchanges/ftx.exchange.interfaces';
import { BinanceFuturesUSDMExchangeService } from '../services/exchanges/binance-usdm.futures.exchange.service';
import { BinanceSpotExchangeService } from '../services/exchanges/binance.spot.exchange.service';
import { FTXExchangeService } from '../services/exchanges/ftx.exchange.service';

export type ExchangeService =
  | BinanceFuturesUSDMExchangeService
  | BinanceSpotExchangeService
  | FTXExchangeService;

export type FuturesPosition = IFTXFuturesPosition | IBinanceFuturesUSDPosition;
