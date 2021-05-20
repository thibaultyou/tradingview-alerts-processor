import { IsString, IsIn, IsOptional } from 'class-validator';

export class Account {
  @IsString()
  apiKey: string;

  @IsString()
  secret: string;

  @IsIn(['ftx', 'binance'])
  @IsString()
  exchange: string;

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
