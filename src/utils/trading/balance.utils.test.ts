import { IBalance } from '../../interfaces/exchanges/common.exchange.interfaces';
import { ExchangeId } from '../../constants/exchanges.constants';

import {
  sampleBinanceSpotBalance,
  sampleBinanceFuturesUSDBalance
} from '../../tests/fixtures/binance.fixtures';
import { sampleBinanceUSSpotBalance } from '../../tests/fixtures/binanceus.fixtures';
import { filterBalances } from './balance.utils';

describe('filterBalances', () => {
  it('should find symbol, free amount, and total amount for Binance', () => {
    const sampleBinanceSpotBalances = {
      info: { balances: [sampleBinanceSpotBalance] }
    };
    const result = filterBalances(
      sampleBinanceSpotBalances,
      ExchangeId.Binance
    ) as IBalance[];
    expect(result[0].coin).toBe(sampleBinanceSpotBalance.asset);
    expect(result[0].free).toBe(sampleBinanceSpotBalance.free);
    expect(result[0].total).toBe(
      parseFloat(sampleBinanceSpotBalance.free) +
        parseFloat(sampleBinanceSpotBalance.locked)
    );
  });

  it('should find symbol, free amount, and total amount for BinanceUS', () => {
    const sampleBinanceUSSpotBalances = {
      info: { balances: [sampleBinanceUSSpotBalance] }
    };
    const result = filterBalances(
      sampleBinanceUSSpotBalances,
      ExchangeId.BinanceUS
    ) as IBalance[];
    expect(result[0].coin).toBe(sampleBinanceUSSpotBalance.asset);
    expect(result[0].free).toBe(sampleBinanceUSSpotBalance.free);
    expect(result[0].total).toBe(
      parseFloat(sampleBinanceUSSpotBalance.free) +
        parseFloat(sampleBinanceUSSpotBalance.locked)
    );
  });

  it('should find symbol, free amount, and total amount for Binance Futures USD', () => {
    const sampleBinanceFuturesUSDBalances = {
      info: { assets: [sampleBinanceFuturesUSDBalance] }
    };
    const result = filterBalances(
      sampleBinanceFuturesUSDBalances,
      ExchangeId.BinanceFuturesUSD
    ) as IBalance[];
    expect(result[0].coin).toBe(sampleBinanceFuturesUSDBalance.asset);
    expect(result[0].free).toBe(
      sampleBinanceFuturesUSDBalance.availableBalance
    );
    expect(result[0].total).toBe(sampleBinanceFuturesUSDBalance.walletBalance);
  });
});
