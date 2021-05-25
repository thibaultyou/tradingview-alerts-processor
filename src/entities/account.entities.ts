import { IsString, IsIn, IsOptional } from 'class-validator';
import { Exchange, EXCHANGES } from '../constants/exchanges.constants';

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
  subaccount?: string;
}

export class AccountStub {
  @IsString()
  stub: string;
}
