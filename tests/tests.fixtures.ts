import { Exchange } from '../src/constants/exchanges.constants';
import { Account } from '../src/entities/account.entities';

export const sampleAccount: Account = {
  apiKey: 'apiKey',
  exchange: Exchange.FTX,
  secret: 'secret',
  stub: 'stub'
};

export const sampleSubaccount: Account = {
  ...sampleAccount,
  subaccount: 'subaccountStub'
};
