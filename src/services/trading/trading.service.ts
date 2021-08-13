import { ExchangeId } from '../../constants/exchanges.constants';
import { TradingExecutor } from './trading.executor';

export class TradingService {
  static executors = new Map<ExchangeId, TradingExecutor>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getTradeExecutor = async (
    exchangeId: ExchangeId
  ): Promise<TradingExecutor> => {
    if (!TradingService.executors.get(exchangeId)) {
      const service = new TradingExecutor(exchangeId);
      await service.init()
      TradingService.executors.set(exchangeId, service);
      service.start();
    }
    return TradingService.executors.get(exchangeId);
  };

  // TODO add startExecutors

  // TODO add stopExecutors

  // TODO add clearExecutors
}
