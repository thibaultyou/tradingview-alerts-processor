import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Side } from '../../constants/trading.constants';
import { Account } from '../../entities/account.entities';
import { Trade } from '../../entities/trade.entities';
import {
  ExchangeInstanceInitError,
  PositionsFetchError
} from '../../errors/exchange.errors';
import { OpenPositionError } from '../../errors/trading.errors';
import { IBinanceFuturesUSDPosition } from '../../interfaces/exchanges.interfaces';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import {
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS,
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS
} from '../../messages/exchange.messages';
import {
  OPEN_TRADE_ERROR_MAX_SIZE,
  OPEN_TRADE_NO_CURRENT_OPENED_POSITION,
  REVERSING_TRADE
} from '../../messages/trading.messages';
import { getAccountId } from '../../utils/account.utils';
import { formatBinanceFuturesSymbol } from '../../utils/exchanges/binance.exchange.utils';
import { getTradeSide } from '../../utils/trading.utils';
import { debug, error } from '../logger.service';
import { FuturesExchangeService } from './base/futures.exchange.service';

export class BinanceFuturesUSDMExchangeService extends FuturesExchangeService {
  constructor() {
    super(ExchangeId.BinanceFuturesUSD);
  }

  getTokenAmountInDollars = (ticker: Ticker, size: number): number => {
    const { high, low } = ticker;
    let dollars = Number(size) * ((high + low) / 2);
    dollars = +dollars.toFixed(2);
    return dollars;
  };

  checkCredentials = async (
    account: Account,
    instance: Exchange
  ): Promise<boolean> => {
    const accountId = getAccountId(account);
    try {
      await this.getPositions(account, instance);
      debug(EXCHANGE_AUTHENTICATION_SUCCESS(accountId, this.exchangeId));
    } catch (err) {
      error(EXCHANGE_AUTHENTICATION_ERROR(accountId, this.exchangeId), err);
      throw new ExchangeInstanceInitError(
        EXCHANGE_AUTHENTICATION_ERROR(accountId, this.exchangeId, err.message)
      );
    }
    return true;
  };

  getTickerPosition = async (
    account: Account,
    ticker: Ticker
  ): Promise<IBinanceFuturesUSDPosition> => {
    const accountId = getAccountId(account);
    const symbol = formatBinanceFuturesSymbol(ticker.symbol);
    const positions = await this.getPositions(account);
    const position = positions.filter((p) => p.symbol === symbol).pop();
    if (!position) {
      debug(
        OPEN_TRADE_NO_CURRENT_OPENED_POSITION(
          accountId,
          this.exchangeId,
          ticker.symbol
        )
      );
    }
    return position;
  };

  getTickerPositionSize = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const position = await this.getTickerPosition(account, ticker);
    if (position) {
      return this.getTokenAmountInDollars(ticker, Number(position.notional));
    }
  };

  getPositions = async (
    account: Account,
    instance?: Exchange
  ): Promise<IBinanceFuturesUSDPosition[]> => {
    const accountId = getAccountId(account);
    try {
      if (!instance) {
        instance = (await this.refreshSession(account)).exchange;
      }
      const positions = await instance.fetchPositions();
      debug(POSITIONS_READ_SUCCESS(accountId, this.exchangeId));
      return positions;
    } catch (err) {
      error(POSITIONS_READ_ERROR(accountId, this.exchangeId), err);
      throw new PositionsFetchError(
        POSITIONS_READ_ERROR(accountId, this.exchangeId, err.message)
      );
    }
  };

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker
  ): Promise<IOrderOptions> => {
    const position = await this.getTickerPosition(account, ticker);
    const size = Number(position.positionAmt);
    return {
      size: Math.abs(size),
      side: size > 0 ? Side.Sell : Side.Buy
    };
  };

  handleReverseOrder = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void> => {
    const { direction } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    const size = await this.getTickerPositionSize(account, ticker);
    if (
      size &&
      ((size < 0 && side === Side.Buy) || (size > 0 && side === Side.Sell))
    ) {
      debug(REVERSING_TRADE(this.exchangeId, accountId, ticker.symbol));
      await this.closeOrder(account, trade, ticker);
    }
  };

  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade,
    orderSize: number
  ): Promise<void> => {
    const { symbol, max, direction } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    const current = await this.getTickerPositionSize(account, ticker);
    if (
      current + this.getTokenAmountInDollars(ticker, orderSize) >
      Number(max)
    ) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
  };
}
