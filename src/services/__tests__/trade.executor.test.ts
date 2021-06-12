import { ExchangeId } from '../../constants/exchanges.constants';
import { TradingExecutor } from '../trade.executor';
describe('Trade executor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('start', () => {
    it('should start trading service', async () => {
      const executor = new TradingExecutor(ExchangeId.FTX);
      expect(executor.getStatus()).toBeFalsy();
      executor.start();
      expect(executor.getStatus()).toBeTruthy();
    });
  });

  describe('stop', () => {
    it('should stop trading service', async () => {
      const executor = new TradingExecutor(ExchangeId.FTX);
      executor.start();
      expect(executor.getStatus()).toBeTruthy();
      executor.stop();
      expect(executor.getStatus()).toBeFalsy();
    });
  });

  describe('addTrade', () => {
    it('should add trade to service queue', async () => {
      expect(true).toBe(false);
    });

    it.skip('should throw if execution has failed', async () => {
      expect(true).toBe(false);
    });
  });

  describe('processTrade', () => {
    it.skip('should process open order', async () => {
      expect(true).toBe(false);
    });

    it.skip('should process close order', async () => {
      expect(true).toBe(false);
    });
  });

  describe('closeTrade', () => {
    it.skip('should process trade', async () => {
      expect(true).toBe(false);
    });

    it.skip('should throw if no position was found for specified symbol', async () => {
      expect(true).toBe(false);
    });

    it.skip('should throw if execution has failed', async () => {
      expect(true).toBe(false);
    });
  });

  describe('openTrade', () => {
    it.skip('should process trade', async () => {
      expect(true).toBe(false);
    });

    it.skip('should throw if execution has failed', async () => {
      expect(true).toBe(false);
    });
  });
});
