import { IsString, IsIn, IsOptional, ValidateIf } from 'class-validator';
import { ExchangeId, EXCHANGES } from '../constants/exchanges.constants';

export class Account {
  @IsString()
  apiKey: string;

  @IsString()
  secret: string;

  @IsIn(EXCHANGES)
  @IsString()
  exchange: ExchangeId;

  @IsString()
  stub: string;

  @IsString()
  @IsOptional()
  subaccount?: string;

  @IsString()
  @ValidateIf((account: Account) => account.exchange === ExchangeId.KuCoin)
  passphrase?: string;
}

export class AccountStub {
  @IsString()
  stub: string;
}
