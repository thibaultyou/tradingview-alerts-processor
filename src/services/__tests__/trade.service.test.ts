import { ExchangeId } from '../../constants/exchanges.constants';
import { TradingService } from '../trade.service';
describe('Trade service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTradeExecutor', () => {
    it('should return executor', async () => {
      expect(TradingService.getTradeExecutor(ExchangeId.FTX)).toBeDefined();
    });
  });

  describe('startExecutors', () => {
    it('should start executors', async () => {
      expect(true).toBe(false);
    });
  });

  describe('stopExecutors', () => {
    it('should stop executors', async () => {
      expect(true).toBe(false);
    });
  });

  describe('clearExecutors', () => {
    it('should remove all executors from TradingService', async () => {
      expect(true).toBe(false);
    });
  });
});
