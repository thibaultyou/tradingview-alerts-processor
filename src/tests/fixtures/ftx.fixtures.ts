import { Exchange, Ticker } from 'ccxt';
import { FTX_SUBACCOUNT_HEADER } from '../../constants/exchanges.constants';
import { sampleExchangeOptions, sampleSubaccount } from './common.fixtures';
import { IFTXBalance } from '../../interfaces/exchanges/ftx.exchange.interfaces';

export const sampleFTXExchangeOptions: Exchange['options'] = {
  ...sampleExchangeOptions,
  headers: { [FTX_SUBACCOUNT_HEADER]: sampleSubaccount.subaccount }
};

// doge is crap, this is just for testing purposes
export const sampleFTXTicker: Ticker = {
  symbol: 'DOGE-PERP',
  timestamp: 1624739108037,
  datetime: '2021-06-26T20:25:08.037Z',
  high: undefined,
  low: undefined,
  bid: 0.2372425,
  bidVolume: undefined,
  ask: 0.237289,
  askVolume: undefined,
  vwap: undefined,
  open: undefined,
  close: 0.2372425,
  last: 0.2372425,
  previousClose: undefined,
  change: undefined,
  percentage: -0.053681584201068604,
  average: undefined,
  baseVolume: undefined,
  quoteVolume: 268879491.7975035,
  info: {
    name: 'DOGE-PERP',
    enabled: true,
    postOnly: false,
    priceIncrement: '5e-7',
    sizeIncrement: '1.0',
    minProvideSize: '1.0',
    last: '0.2372425',
    bid: '0.2372425',
    ask: '0.237289',
    price: '0.2372425',
    type: 'future',
    baseCurrency: null,
    quoteCurrency: null,
    underlying: 'DOGE',
    restricted: false,
    highLeverageFeeExempt: false,
    change1h: '-0.00970912286047623',
    change24h: '-0.053681584201068604',
    changeBod: '0.006768584432255806',
    quoteVolume24h: '268879491.7975035',
    volumeUsd24h: '268879491.7975035'
  }
};

export const sampleFTXBalance: IFTXBalance = {
  coin: 'DOGE',
  total: '0.7922939',
  free: '0.7922939',
  availableWithoutBorrow: '0.7922939',
  usdValue: '0.194515504937392',
  spotBorrow: '0.0'
};
