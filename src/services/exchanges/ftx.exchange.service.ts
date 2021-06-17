import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { IFTXFuturesPosition } from '../../interfaces/exchange.interfaces';
import { getAccountId } from '../../utils/account.utils';
import { FuturesExchangeService } from './futures.exchange.service';
import { Ticker } from 'ccxt';
import { getInvertedTradeSide, getTradeSide } from '../../utils/trade.utils';
import { Side } from '../../constants/trade.constants';
import { IOrderOptions } from '../../interfaces/trade.interface';
import {
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS
} from '../../messages/exchange.messages';
import { debug, error } from '../logger.service';
import { PositionsFetchError } from '../../errors/exchange.errors';
import { Trade } from '../../entities/trade.entities';
import { formatFTXSpotSymbol } from '../../utils/exchange.utils';

export class FTXExchangeService extends FuturesExchangeService {
  constructor() {
    super(ExchangeId.FTX);
  }

  getTokenAmountInDollars = (ticker: Ticker, size: number): number => {
    const { ask, bid } = ticker;
    let dollars = Number(size) * ((ask + bid) / 2);
    dollars = +dollars.toFixed(2);
    return dollars;
  };

  getTickerBalance = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const symbol = formatFTXSpotSymbol(ticker.symbol);
    try {
      const balances = await this.getBalances(account);
      const balance = balances.filter((b) => b.coin === symbol).pop();
      if (!balance) {
        // TODO debug
      }
      return this.getTokenAmountInDollars(ticker, Number(balance.free));
    } catch (err) {
      // TODO error
      // TODO throw
    }
  };

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker
  ): Promise<IOrderOptions> => {
    let options: IOrderOptions = {
      size: 0,
      side: 'sell'
    };
    if (ticker.info.type === 'spot') {
      ticker.info.baseCurrency;
      const balance = await this.getTickerBalance(account, ticker);
      if (balance) {
        options = {
          side: Side.Sell,
          size: balance
        };
      }
    } else {
      const symbol = ticker.info.name;
      const positions = await this.getPositions(account);
      const position = positions
        .filter((p: IFTXFuturesPosition) => p.future === symbol)
        .pop();
      if (position) {
        options = {
          size: Number(position.size),
          side: getInvertedTradeSide(position.side as Side)
        };
      }
    }

    return options;
  };

  getTickerPosition = async (
    account: Account,
    ticker: Ticker
  ): Promise<IFTXFuturesPosition> => {
    const positions = await this.getPositions(account);
    const position = positions.filter((p) => p.future === ticker.symbol).pop();
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
      return this.getTokenAmountInDollars(ticker, Number(position.size));
    }
  };

  getPositions = async (account: Account): Promise<IFTXFuturesPosition[]> => {
    const accountId = getAccountId(account);
    try {
      const accountInfos = await this.sessions
        .get(accountId)
        .exchange.privateGetAccount();
      const positions = accountInfos.result.positions;
      debug(POSITIONS_READ_SUCCESS(accountId, this.exchangeId));
      return positions;
    } catch (err) {
      error(POSITIONS_READ_ERROR(accountId, this.exchangeId), err);
      throw new PositionsFetchError(
        POSITIONS_READ_ERROR(accountId, this.exchangeId, err.message)
      );
    }
  };

  getClosingStatus = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    const { direction } = trade;
    const side = getTradeSide(direction);
    const position = await this.getTickerPosition(account, ticker);
    if (position) {
      const size = this.getTokenAmountInDollars(ticker, Number(position.size));
      if (size && getTradeSide(position.side as Side) !== side) {
        return true;
      }
    }
    return false;
  };
}
