/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ticker } from 'ccxt';
import { Side } from '../../../constants/trading.constants';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { TickerFetchError } from '../../../errors/exchange.errors';
import { OpenPositionError } from '../../../errors/trading.errors';
import { ISpotExchange } from '../../../interfaces/exchanges/base/spot.exchange.interfaces';
import { IOrderOptions } from '../../../interfaces/trading.interfaces';
import {
  TICKER_BALANCE_READ_SUCCESS,
  TICKER_BALANCE_READ_ERROR
} from '../../../messages/exchanges.messages';
import { OPEN_TRADE_ERROR_MAX_SIZE } from '../../../messages/trading.messages';
import { getAccountId } from '../../../utils/account.utils';
import {
  getOrderCost,
  getRelativeOrderSize,
  getTokensAmount
} from '../../../utils/trading/conversion.utils';
import { getSide } from '../../../utils/trading/side.utils';
import { getSpotSymbol } from '../../../utils/trading/symbol.utils';
import { getTickerPrice } from '../../../utils/trading/ticker.utils';
import { debug, error } from '../../logger.service';
import { BaseExchangeService } from './base.exchange.service';

export abstract class SpotExchangeService
  extends BaseExchangeService
  implements ISpotExchange
{
  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade,
    balance: number
  ): Promise<void> => {
    const { max, direction, size } = trade;
    const { symbol } = ticker;
    const accountId = getAccountId(account);
    const side = getSide(direction);
    const current = await this.getTickerBalance(account, ticker);
    if (
      getOrderCost(ticker, this.exchangeId, current) + // get cost of current position
        (size.includes('%') // add the required position cost
          ? getRelativeOrderSize(balance, size)
          : Number(size)) >
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

  getTickerBalance = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const accountId = getAccountId(account);
    const symbol = getSpotSymbol(ticker.symbol);
    try {
      const balances = await this.getBalances(account);
      const balance = balances.filter((b) => b.coin === symbol).pop();
      const size = Number(balance.free);
      debug(
        TICKER_BALANCE_READ_SUCCESS(this.exchangeId, accountId, symbol, balance)
      );
      return size;
    } catch (err) {
      error(TICKER_BALANCE_READ_ERROR(this.exchangeId, accountId, symbol, err));
      throw new TickerFetchError(
        TICKER_BALANCE_READ_ERROR(this.exchangeId, accountId, symbol, err)
      );
    }
  };

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    const { size } = trade;
    const { symbol } = ticker;
    const balance = await this.getTickerBalance(account, ticker);
    const price = getTickerPrice(ticker, this.exchangeId);
    return {
      side: Side.Sell,
      size: size
        ? size.includes('%')
          ? getRelativeOrderSize(balance, size) // handle percentage
          : getTokensAmount(symbol, price, Number(size)) // handle absolute
        : balance // default 100%
    };
  };

  handleOrderModes = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    // TODO add trading modes for spot markets
    return true;
  };
}
