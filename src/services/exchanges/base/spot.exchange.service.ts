import { Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { OpenPositionError } from '../../../errors/trading.errors';
import { ISpotExchange } from '../../../interfaces/exchanges/base/spot.exchange.interface';
import { OPEN_TRADE_ERROR_MAX_SIZE } from '../../../messages/trading.messages';
import { getAccountId } from '../../../utils/account.utils';
import { getRelativeTradeSize } from '../../../utils/exchanges/common.exchange.utils';
import { getTradeSide } from '../../../utils/trading.utils';
import { error } from '../../logger.service';
import { BaseExchangeService } from './base.exchange.service';

export abstract class SpotExchangeService
  extends BaseExchangeService
  implements ISpotExchange
{
  abstract getTickerBalance(account: Account, ticker: Ticker): Promise<number>;

  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade,
    balance: number
  ): Promise<void> => {
    const { max, direction, size } = trade;
    const { symbol } = ticker;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    const current = await this.getTickerBalance(account, ticker);
    if (
      this.getOrderCost(ticker, current) + // get cost of current position
        (size.includes('%') // add the required position cost
          ? getRelativeTradeSize(ticker, balance, size)
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
}
