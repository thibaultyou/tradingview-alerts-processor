import { formatBinanceFuturesSymbol } from '../binance.utils';

describe('Binance utils', () => {
  describe('formatBinanceFuturesSymbol', () => {
    it('should formatted symbol', () => {
      const symbol = 'BTC/USDT';
      expect(formatBinanceFuturesSymbol(symbol)).toEqual('BTCUSDT');
    });
  });
});
