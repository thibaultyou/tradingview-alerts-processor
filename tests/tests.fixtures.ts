import ccxt = require('ccxt');
import {
  Exchange,
  FTX_SUBACCOUNT_HEADER
} from '../src/constants/exchanges.constants';
import { Account } from '../src/entities/account.entities';
import { IBalance, IBalances } from '../src/interfaces/exchange.interfaces';

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

export const sampleExchangeOptions: ccxt.Exchange['options'] = {
  apiKey: sampleAccount.apiKey,
  secret: sampleAccount.secret
};

export const sampleFTXExchangeOptions: ccxt.Exchange['options'] = {
  ...sampleExchangeOptions,
  headers: { [FTX_SUBACCOUNT_HEADER]: sampleSubaccount.subaccount }
};

export const sampleBalance: IBalance = {
  coin: 'BTC-PERP',
  free: '0.1',
  total: '0.2'
};

export const sampleBalances: IBalances = {
  info: { result: [sampleBalance] }
};
