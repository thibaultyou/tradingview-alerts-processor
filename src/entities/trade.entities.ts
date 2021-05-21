import { IsIn, IsString } from 'class-validator';
import { SIDES } from '../constants/trade.constants';

export class Trade {
  @IsString()
  stub: string;

  @IsString()
  size: string;

  @IsString()
  symbol: string;

  @IsString()
  @IsIn(SIDES)
  direction: string;
}
