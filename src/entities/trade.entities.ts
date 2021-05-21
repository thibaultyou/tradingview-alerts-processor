import { IsIn, IsOptional, IsString } from 'class-validator';
import { SIDES } from '../constants/trade.constants';

export class Trade {
  @IsString()
  stub: string;

  @IsString()
  @IsOptional()
  size: string;

  @IsString()
  symbol: string;

  @IsString()
  @IsIn(SIDES)
  direction: string;
}
