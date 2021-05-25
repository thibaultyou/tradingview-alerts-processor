import { IsIn, IsString } from 'class-validator';
import { Exchange, EXCHANGES } from '../constants/exchanges.constants';

export class Market {
  @IsIn(EXCHANGES)
  @IsString()
  exchange: Exchange;
}
