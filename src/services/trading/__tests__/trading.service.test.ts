import { sampleExchangeId } from '../../../tests/fixtures/common.fixtures';
import { TradingService } from '../trading.service';

describe('Trading service', () => {
  describe('getTradeExecutor', () => {
    beforeEach(() => {
      TradingService.executors.clear();
    });

    it('should return executor', () => {
      const executor = TradingService.getTradeExecutor(sampleExchangeId);
      expect(executor).not.toBeNull();
    });

    it('should add executor to cache', () => {
      expect(TradingService.executors.size).toStrictEqual(0);
      TradingService.getTradeExecutor(sampleExchangeId);
      expect(TradingService.executors.size).toStrictEqual(1);
    });

    it('should start executor', () => {
      TradingService.getTradeExecutor(sampleExchangeId);
      expect(
        TradingService.getTradeExecutor(sampleExchangeId).getStatus()
      ).toBeTruthy();
    });

    it('should not init executor if already started', () => {
      const executor = TradingService.getTradeExecutor(sampleExchangeId);
      const spy = jest.spyOn(executor, 'start').mockImplementation(() => null);
      expect(spy).toBeCalledTimes(0);
      TradingService.getTradeExecutor(sampleExchangeId);
      expect(spy).toBeCalledTimes(0);
    });
  });
});
