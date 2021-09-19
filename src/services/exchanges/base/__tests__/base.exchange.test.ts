// import { Ticker } from 'ccxt';
// import { Account } from '../../../../entities/account.entities';
// import { Trade } from '../../../../entities/trade.entities';
import { IOrderOptions } from '../../../../interfaces/trading.interfaces';
import { ExchangeId } from '../../../../constants/exchanges.constants';
import { BaseExchangeService } from '../base.exchange.service';
//import * as MyBaseExchangeService from '../base.exchange.service'; const BaseExchangeService = MyBaseExchangeService.BaseExchangeService;

describe('Base exchange service', () => {
  describe('constructor', () => {
    // class MockExchangeService extends BaseExchangeService {
    //   getCloseOrderOptions(): Promise<IOrderOptions> {
    //     throw new Error('Method not implemented.');
    //   }
    //   handleMaxBudget(): Promise<void> {
    //     throw new Error('Method not implemented.');
    //   }
    // }
    // let exchangeService: MockExchangeService;
    // beforeEach(() => {
    //   exchangeService = new MockExchangeService(ExchangeId.BinanceUS);
    // });
    // it('should set exchange id', () => {
    //   expect(exchangeService.exchangeId).toBe(ExchangeId.BinanceUS);
    // });
    // it('should init default exchange instance', () => {
    //   expect(exchangeService.defaultExchange).toBeDefined();
    // });
  });

  describe('checkCredentials', () => {
    it.todo('should check balances');

    it.todo('should return success');

    it.todo('should throw on error');
  });

  describe('refreshSession', () => {
    it.todo('should load session from cache if any');

    it.todo('should load exchange options');

    it.todo('should init exchange instance');

    it.todo('should add exchange instance to cache');

    it.todo('should reload session from cache');

    it.todo('should throw on error');
  });

  describe('getBalances', () => {
    it.todo('should refresh session if instance not provided');

    it.todo('should fetch balances');

    it.todo('should return non-empty balances');

    it.todo('should throw on error');
  });

  describe('getTicker', () => {
    it.todo('should fetch ticker');

    it.todo('should return ticker');

    it.todo('should throw on error');
  });

  describe('getMarkets', () => {
    it.todo('should fetch markets');

    it.todo('should return available markets');

    it.todo('should throw on error');
  });

  describe('getAvailableFunds', () => {
    it.todo('should fetch FTX free collateral (futures)');

    it.todo('should fetch non-empty balances');

    it.todo('should filter quote balance');

    it.todo('should return available funds');

    it.todo('should throw on error');
  });

  describe('getOpenOrderOptions', () => {
    it.todo('should fetch available funds');

    it.todo('should calculate relative order size');

    it.todo('should handle max budget');

    it.todo('should get ticker price');

    it.todo('should convert trade size from dollars to tokens');

    it.todo('should return order options');

    it.todo('should throw on error');
  });

  describe('createOrder', () => {
    it.todo('should refresh session');

    it.todo('should fetch ticker');

    it.todo(
      'should create close order on sell / short if exchange type is spot'
    );

    it.todo('should create open order on long / buy');

    it.todo(
      'should create open order on sell / short if exchange type is futures'
    );

    it.todo('should return order');

    it.todo('should throw on error');
  });

  describe('createOpenOrder', () => {
    it.todo('should prepare order options');

    it.todo('should calculate order cost');

    it.todo('should create market order');

    it.todo('should return order');

    it.todo('should throw on error');
  });

  describe('createCloseOrder', () => {
    it.todo('should refresh session');

    it.todo('should fetch ticker if not preloaded');

    it.todo('should not fetch ticker if preloaded');

    it.todo('should prepare order options');

    it.todo('should calculate order cost');

    it.todo('should create market order');

    it.todo('should return order');

    it.todo('should throw on error');
  });
});
