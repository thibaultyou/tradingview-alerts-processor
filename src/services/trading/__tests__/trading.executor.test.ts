import {
  sampleExchangeId,
  sampleAccount,
  sampleTrade,
  sampleLongOrder,
  sampleShortOrder,
  sampleBuyOrder,
  sampleSellOrder,
  sampleCloseOrder
} from '../../../tests/fixtures/common.fixtures';
import { FTXExchangeService } from '../../exchanges/ftx.exchange.service';
import { TradingExecutor } from '../trading.executor';
import { DELAY_BETWEEN_TRADES } from '../../../constants/exchanges.constants';

let executor: TradingExecutor;
jest.useFakeTimers();

describe('Trading executor', () => {
  beforeEach(() => {
    if (executor) {
      executor.stop();
    }
    executor = new TradingExecutor(sampleExchangeId);
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('constructor', () => {
    it('should init exchange service', () => {
      expect(executor.getExchangeService().exchangeId).toStrictEqual(
        sampleExchangeId
      );
      expect(executor.getExchangeService()).toBeInstanceOf(FTXExchangeService);
    });
  });

  describe('getExchangeService', () => {
    it('should return exchange service', () => {
      expect(executor.getExchangeService()).toBeDefined();
    });
  });

  describe('getStatus', () => {
    it('should return running status', () => {
      expect(executor.getStatus()).toBeFalsy();
    });
  });

  describe('start', () => {
    it('should start executor', () => {
      executor.stop();
      expect(executor.getStatus()).toBeFalsy();
      executor.start();
      expect(executor.getStatus()).toBeTruthy();
    });

    it('should not start executor if started', () => {
      expect(executor.start()).toBeTruthy();
      expect(executor.start()).toBeFalsy();
    });

    it('should process trades', () => {
      const spy = jest
        .spyOn(executor, 'processTrade')
        .mockImplementation(() => null);
      executor.start();
      executor.addTrade(sampleAccount, sampleTrade);
      executor.addTrade(sampleAccount, sampleTrade);
      executor.addTrade(sampleAccount, sampleTrade);
      jest.advanceTimersByTime(2000);
      expect(spy).toBeCalledTimes(3);
    });

    it('should add a delay between trades', () => {
      const spy = jest
        .spyOn(executor, 'processTrade')
        .mockImplementation(() => null);
      executor.start();
      executor.addTrade(sampleAccount, sampleTrade);
      expect(spy).toBeCalledTimes(0);
      jest.advanceTimersByTime(
        DELAY_BETWEEN_TRADES[executor.getExchangeService().exchangeId] + 50
      );
      expect(spy).toBeCalledTimes(1);
      executor.addTrade(sampleAccount, sampleTrade);
      jest.advanceTimersByTime(
        DELAY_BETWEEN_TRADES[executor.getExchangeService().exchangeId] + 50
      );
      expect(spy).toBeCalledTimes(2);
    });
  });

  describe('stop', () => {
    it('should stop executor', () => {
      executor.start();
      expect(executor.getStatus()).toBeTruthy();
      executor.stop();
      expect(executor.getStatus()).toBeFalsy();
    });

    it('should not stop executor if stopped', () => {
      expect(executor.getStatus()).toBeFalsy();
      executor.start();
      expect(executor.getStatus()).toBeTruthy();
    });
  });

  describe('addTrade', () => {
    // TODO not sure that we need this one since adding the trade infos to the queue should not throw
    it.todo('should throw on error');

    it('should return success', () => {
      expect(executor.addTrade(sampleAccount, sampleTrade)).toBeTruthy();
    });
  });

  describe('processTrade', () => {
    it('should process long / short / buy / sell orders', async () => {
      const spy = jest
        .spyOn(executor.getExchangeService(), 'createOrder')
        .mockImplementation(() => null);
      jest
        .spyOn(executor.getExchangeService(), 'createCloseOrder')
        .mockImplementation(() => null);
      await executor.processTrade(sampleLongOrder);
      await executor.processTrade(sampleShortOrder);
      await executor.processTrade(sampleBuyOrder);
      await executor.processTrade(sampleSellOrder);
      await executor.processTrade(sampleCloseOrder);
      expect(spy).toHaveBeenCalledTimes(4);
    });

    it('should process close order', async () => {
      const spy = jest
        .spyOn(executor.getExchangeService(), 'createCloseOrder')
        .mockImplementation(() => null);
      jest
        .spyOn(executor.getExchangeService(), 'createOrder')
        .mockImplementation(() => null);
      await executor.processTrade(sampleCloseOrder);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return processed order', async () => {
      const mock = { test: 'test' } as any;
      jest
        .spyOn(executor.getExchangeService(), 'createCloseOrder')
        .mockImplementation(() => mock);
      jest
        .spyOn(executor.getExchangeService(), 'createOrder')
        .mockImplementation(() => null);
      const res = await executor.processTrade(sampleCloseOrder);
      expect(res).toEqual(mock);
    });
  });
});
