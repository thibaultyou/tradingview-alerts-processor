import { IBalance } from '../../../interfaces/exchanges/common.exchange.interfaces';
import { ExchangeId } from '../../../constants/exchanges.constants';

import {
  sampleBinanceSpotBalance,
  sampleBinanceFuturesUSDBalance
} from '../../../tests/fixtures/binance.fixtures';
import { sampleBinanceUSSpotBalance } from '../../../tests/fixtures/binanceus.fixtures';
import { filterBalances } from '../balance.utils';

describe('Balance utils', () => {
  describe('filterBalances', () => {
    it('should return Binance Spot balances', () => {
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

    it('should return BinanceUS Spot balances', () => {
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

    it('should return Binance Futures USD balances', () => {
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
      expect(result[0].total).toBe(
        sampleBinanceFuturesUSDBalance.walletBalance
      );
    });

    it.todo('should return KuCoin Spot balances');

    it.todo('should return Kraken Spot balances');

    it.todo('should return FTX balances');
  });
});
