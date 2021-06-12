import { ExchangeId } from '../constants/exchanges.constants';
import { TradingExecutor } from './trade.executor';

export class TradingService {
  static executors: Map<ExchangeId, TradingExecutor> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getTradeExecutor = (exchange: ExchangeId): TradingExecutor => {
    if (!TradingService.executors.get(exchange)) {
      const service = new TradingExecutor(exchange);
      TradingService.executors.set(exchange, service);
      service.start();
    }
    return TradingService.executors.get(exchange);
  };

  // TODO add startExecutors

  // TODO add stopExecutors

  // TODO add clearExecutors
}
