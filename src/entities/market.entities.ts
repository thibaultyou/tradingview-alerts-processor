import { IsIn, IsString } from 'class-validator';
import { ExchangeId, EXCHANGES } from '../constants/exchanges.constants';

export class Market {
  @IsIn(EXCHANGES)
  @IsString()
  exchange: ExchangeId;
}
