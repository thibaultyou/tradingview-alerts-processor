import { ExchangeId } from '../constants/exchanges.constants';
import { TradingExecutor } from './trade.executor';

export class TradingService {
  static executors = new Map<ExchangeId, TradingExecutor>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getTradeExecutor = (
    exchangeId: ExchangeId
  ): TradingExecutor => {
    if (!TradingService.executors.get(exchangeId)) {
      const service = new TradingExecutor(exchangeId);
      TradingService.executors.set(exchangeId, service);
      service.start();
    }
    return TradingService.executors.get(exchangeId);
  };

  // TODO add startExecutors

  // TODO add stopExecutors

  // TODO add clearExecutors
}
