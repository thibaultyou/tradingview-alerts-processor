import { IsIn, IsOptional, IsString, ValidateIf } from 'class-validator';
import { SIDES, Side } from '../constants/trade.constants';

export class Trade {
  @IsString()
  stub: string;

  @IsString()
  @ValidateIf((o) => !(o.direction === Side.Close))
  size: string;

  @IsString()
  @IsOptional()
  max?: string;

  @IsOptional()
  reverse?: true | string;

  @IsString()
  symbol: string;

  @IsString()
  @IsIn(SIDES)
  direction: Side;
}
