import { IsIn, IsString } from 'class-validator';
import { EXCHANGES } from '../constants/exchanges.constants';
import { Exchange } from '../types/exchange.types';

export class Market {
  @IsIn(EXCHANGES)
  @IsString()
  exchange: Exchange;
}
