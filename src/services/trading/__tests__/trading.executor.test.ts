describe('Trading executor', () => {
  describe('constructor', () => {
    it.todo(
      'should init exchange service'
    );
  });

  describe('getExchangeService', () => {
    it.todo('should return exchange service')
  })

  describe('getStatus', () => {
    it.todo('should return running status')
  })

  describe('start', () => {
    it.todo('should start executor')

    it.todo('should not start executor if started')

    it.todo('should update running status')

    it.todo('should process trades')

    it.todo('should add a delay between trades')
  })

  describe('stop', () => {
    it.todo('should stop executor')

    it.todo('should update running status')

    it.todo('should not stop executor if stopped')
  })

  describe('addTrade', () => {
    it.todo('should add trade to execution queue')

    it.todo('should throw on error')

    it.todo('should return success')
  })

  describe('processTrade', () => {
    it.todo('should process create order')

    it.todo('should process close order')

    it.todo('should return processed order')
  })
});
