import { Exchange } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Side } from '../../constants/trading.constants';
import { Account } from '../../entities/account.entities';
import { Market } from '../../entities/market.entities';
import { Trade } from '../../entities/trade.entities';
import { IBalance } from '../../interfaces/exchanges/common.exchange.interfaces';
import { ITradeInfo } from '../../interfaces/trading.interfaces';
import { v4 as uuidv4 } from 'uuid';

export const sampleExchangeId: ExchangeId = ExchangeId.FTX;

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

export const sampleTrade: Trade = {
  direction: Side.Long,
  size: '10',
  stub: 'test',
  symbol: 'BTC-PERP'
};

export const sampleBaseOrder : ITradeInfo = {account : sampleAccount, id: uuidv4(), trade: sampleTrade }

export const getSampleOrder = (side: Side): ITradeInfo => ({ ...sampleBaseOrder, trade: { ...sampleBaseOrder.trade, direction: side}})

export const sampleLongOrder : ITradeInfo = getSampleOrder(Side.Long)

export const sampleShortOrder : ITradeInfo = getSampleOrder(Side.Short)

export const sampleBuyOrder : ITradeInfo = getSampleOrder(Side.Buy)

export const sampleSellOrder : ITradeInfo = getSampleOrder(Side.Sell)

export const sampleCloseOrder : ITradeInfo = getSampleOrder(Side.Close)