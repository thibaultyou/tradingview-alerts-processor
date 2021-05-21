import { IsString, IsIn, IsOptional } from 'class-validator';
import { EXCHANGES } from '../constants/exchanges.constants';
import { Exchange } from '../types/exchange.types';

export class Account {
  @IsString()
  apiKey: string;

  @IsString()
  secret: string;

  @IsIn(EXCHANGES)
  @IsString()
  exchange: Exchange;

  @IsString()
  stub: string;

  @IsString()
  @IsOptional()
  subaccount: string;
}

export class AccountStub {
  @IsString()
  stub: string;
}
