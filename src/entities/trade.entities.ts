import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  ValidateIf
} from 'class-validator';
import { SIDES, Side } from '../constants/trading.constants';

export class Trade {
  @IsString()
  stub: string;

  @IsString()
  @ValidateIf((o) => o.direction !== Side.Close && o.direction !== Side.Sell)
  size: string;

  @IsString()
  @IsOptional()
  max?: string;

  // @IsString()
  // @IsIn(TRADING_MODES)
  // @IsOptional()
  // mode?: TradingMode;

  @IsString()
  @Matches(/.*(PERP|USD).*/)
  symbol: string;

  @IsString()
  @IsIn(SIDES)
  direction: Side;
}
