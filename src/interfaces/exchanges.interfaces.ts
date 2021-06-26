import { Exchange, Order, Ticker } from 'ccxt';
import { ExchangeId } from '../constants/exchanges.constants';
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { FuturesPosition } from '../types/exchanges.types';
import { IOrderOptions } from './trading.interfaces';

export interface IBalance {
  coin: string;
  total: string;
  free: string;
}

export interface ISession {
  account: Account;
  exchange: Exchange;
}

export interface ICommonExchange {
  exchangeId: ExchangeId;
  defaultExchange: Exchange;
  sessions: Map<string, ISession>;
  tickers: Map<string, Ticker>;

  getTokenAmountInDollars(ticker: Ticker, size: number): number;

  getCloseOrderOptions(
    account: Account,
    ticker: Ticker
  ): Promise<IOrderOptions>;

  checkCredentials(account: Account, instance: Exchange): Promise<boolean>;

  handleMaxBudget(
    account: Account,
    ticker: Ticker,
    trade: Trade,
    orderSize: number
  ): Promise<void>;

  refreshSession(account: Account): Promise<ISession>;

  getTicker(symbol: string): Promise<Ticker>;

  closeOrder(account: Account, trade: Trade, ticker?: Ticker): Promise<Order>;

  openOrder(account: Account, trade: Trade): Promise<Order>;

  handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;
}

export interface IFuturesExchange {
  getPositions(
    account: Account,
    instance?: Exchange
  ): Promise<FuturesPosition[]>;

  getTickerPosition(account: Account, ticker: Ticker): Promise<FuturesPosition>;

  getTickerPositionSize(account: Account, ticker: Ticker): Promise<number>;
}

export interface ISpotExchange {
  getTickerBalance(account: Account, ticker: Ticker): Promise<number>;

  getBalances(account: Account, instance?: Exchange): Promise<IBalance[]>;
}

export interface IFTXFuturesPosition {
  future: string;
  size: string;
  side: string;
  netSize: string;
  longOrderSize: string;
  shortOrderSize: string;
  cost: string;
  entryPrice: number;
  unrealizedPnl: string;
  realizedPnl: string;
  initialMarginRequirement: string;
  maintenanceMarginRequirement: string;
  openSize: string;
  collateralUsed: string;
  estimatedLiquidationPrice: number;
}

export interface IBinanceFuturesUSDPosition {
  symbol: string;
  initialMargin: string;
  maintMargin: string;
  unrealizedProfit: string;
  positionInitialMargin: string;
  openOrderInitialMargin: string;
  leverage: string;
  isolated: boolean;
  entryPrice: string;
  maxNotional: string;
  positionSide: string;
  positionAmt: string;
  notional: string;
  isolatedWallet: string;
  updateTime: string;
}
