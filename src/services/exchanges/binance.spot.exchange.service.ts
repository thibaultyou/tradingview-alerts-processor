import { Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { IOrderOptions } from '../../interfaces/trade.interface';
import { CommonExchangeService } from './common.exchange.service';
import { Side } from '../../constants/trade.constants';
import { Trade } from '../../entities/trade.entities';
import { formatBinanceSpotSymbol } from '../../utils/exchange.utils';

export class BinanceSpotExchangeService extends CommonExchangeService {
  constructor() {
    super(ExchangeId.Binance);
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
    const symbol = formatBinanceSpotSymbol(ticker.symbol);
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
    const balance = await this.getTickerBalance(account, ticker);
    return {
      side: Side.Sell,
      size: balance
    };
  };

  getClosingStatus(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
