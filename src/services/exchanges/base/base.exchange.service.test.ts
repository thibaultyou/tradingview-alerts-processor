describe('BaseExchangeService', () => {
  describe('createOrder', () => {
    it.todo('should call createCloseOrder for SELL orders on Spot exchanges');

    it.todo('should call createOpenOrder for SHORT orders on Futures exchanges');

    it.todo('should throw an error CLOSE orders'); // These are handled by TradeExecutor's processTrade()

    it.todo('should call createOpenOrder for BUY orders');

    it.todo('should call createOpenOrder for LONG orders');
  });
});