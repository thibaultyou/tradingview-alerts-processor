import { Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Side } from '../../constants/trade.constants';
import { Account } from '../../entities/account.entities';
import { Trade } from '../../entities/trade.entities';
import { PositionsFetchError } from '../../errors/exchange.errors';
import { IBinanceFuturesUSDPosition } from '../../interfaces/exchange.interfaces';
import { IOrderOptions } from '../../interfaces/trade.interface';
import {
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS
} from '../../messages/exchange.messages';
import { OPEN_TRADE_NO_CURRENT_OPENED_POSITION } from '../../messages/trade.messages';
import { getAccountId } from '../../utils/account.utils';
import { formatBinanceFuturesSymbol } from '../../utils/exchange.utils';
import { getTradeSide } from '../../utils/trade.utils';
import { debug, error } from '../logger.service';
import { FuturesExchangeService } from './futures.exchange.service';

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

  getTickerBalance = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const accountId = getAccountId(account);
    const symbol = formatBinanceFuturesSymbol(ticker.symbol);
    // TODO catch err
    const position = (await this.getTickerPosition(
      account,
      ticker
    )) as IBinanceFuturesUSDPosition;
    if (position) {
      return this.getTokenAmountInDollars(ticker, Number(position.notional));
    } else {
      debug(
        OPEN_TRADE_NO_CURRENT_OPENED_POSITION(
          accountId,
          this.exchangeId,
          symbol
        )
      );
    }
  };

  getTickerPosition = async (
    account: Account,
    ticker: Ticker
  ): Promise<IBinanceFuturesUSDPosition> => {
    const symbol = formatBinanceFuturesSymbol(ticker.symbol);
    const positions = await this.getPositions(account);
    const position = positions.filter((p) => p.symbol === symbol).pop();
    if (!position) {
      // TODO debug
      // debug(
      //   OPEN_TRADE_NO_CURRENT_OPENED_POSITION(
      //     accountId,
      //     this.exchangeId,
      //     symbol
      //   )
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
    account: Account
  ): Promise<IBinanceFuturesUSDPosition[]> => {
    const accountId = getAccountId(account);
    try {
      const positions = await this.sessions
        .get(accountId)
        .exchange.fetchPositions();
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

  getClosingStatus = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    const { direction } = trade;
    const side = getTradeSide(direction);
    const size = await this.getTickerPositionSize(account, ticker);
    if (
      size &&
      ((size < 0 && side === Side.Buy) || (size > 0 && side === Side.Sell))
    ) {
      return true;
    }
    return false;
  };
}
