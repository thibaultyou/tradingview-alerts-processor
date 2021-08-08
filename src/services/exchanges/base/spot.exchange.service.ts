/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ticker } from 'ccxt';
import { Side } from '../../../constants/trading.constants';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { OpenPositionError } from '../../../errors/trading.errors';
import { ISpotExchange } from '../../../interfaces/exchanges/base/spot.exchange.interfaces';
import { IOrderOptions } from '../../../interfaces/trading.interfaces';
import { OPEN_TRADE_ERROR_MAX_SIZE } from '../../../messages/trading.messages';
import { getAccountId } from '../../../utils/account.utils';
import {
  getTokensPrice,
  getRelativeOrderSize,
  getTokensAmount
} from '../../../utils/trading/conversion.utils';
import { getSide } from '../../../utils/trading/side.utils';
import { getTickerPrice } from '../../../utils/trading/ticker.utils';
import { error } from '../../logger.service';
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
      getTokensPrice(ticker, this.exchangeId, current) +
        (size.includes('%')
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
