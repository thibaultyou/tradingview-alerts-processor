import { Exchange } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { Market } from '../../entities/market.entities';
import { IBalance } from '../../interfaces/exchanges/common.exchange.interfaces';

export const sampleAccount: Account = {
  apiKey: 'apiKey',
  exchange: ExchangeId.FTX,
  secret: 'secret',
  stub: 'stub'
};

export const sampleSubaccount: Account = {
  ...sampleAccount,
  subaccount: 'subaccountStub'
};

export const sampleExchangeOptions: Exchange['options'] = {
  apiKey: sampleAccount.apiKey,
  secret: sampleAccount.secret
};

export const sampleSymbol = 'BTC-PERP';

export const sampleBalance: IBalance = {
  coin: sampleSymbol,
  free: '0.1',
  total: '0.2'
};

export const sampleBalances = {
  info: { result: [sampleBalance] }
};

export const sampleMarket: Market = {
  exchange: ExchangeId.FTX
};

export const invalidMarket = {
  exchange: 'test'
} as unknown as Market;

export const invalidSymbol = 'invalidSymbol';
