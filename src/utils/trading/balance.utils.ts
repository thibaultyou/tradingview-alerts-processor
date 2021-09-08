import { ExchangeId } from '../../constants/exchanges.constants';
import {
  IBinanceFuturesUSDBalance,
  IBinanceSpotBalance,
  IBinanceUSSpotBalance
} from '../../interfaces/exchanges/binance.exchange.interfaces';
import { IBalance } from '../../interfaces/exchanges/common.exchange.interfaces';
import { IFTXBalance } from '../../interfaces/exchanges/ftx.exchange.interfaces';
import { IKuCoinBalance } from '../../interfaces/exchanges/kucoin.exchange.interfaces';

export const filterBalances = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  balances: any,
  exchangeId: ExchangeId
): IBalance[] => {
  switch (exchangeId) {
    case ExchangeId.Binance:
      return balances.info.balances
        .filter((b: IBinanceSpotBalance) => Number(b.free))
        .map((b: IBinanceSpotBalance) => ({
          coin: b.asset,
          free: b.free,
          total: Number(b.free) + Number(b.locked)
        }));
    case ExchangeId.BinanceUS:
      return balances.info.balances
        .filter((b: IBinanceUSSpotBalance) => Number(b.free))
        .map((b: IBinanceUSSpotBalance) => ({
          coin: b.asset,
          free: b.free,
          total: Number(b.free) + Number(b.locked)
        }));
    case ExchangeId.BinanceFuturesUSD:
      return balances.info.assets
        .filter((b: IBinanceFuturesUSDBalance) => Number(b.availableBalance))
        .map((b: IBinanceFuturesUSDBalance) => ({
          coin: b.asset,
          free: b.availableBalance,
          total: b.walletBalance
        }));
    case ExchangeId.KuCoin:
      return balances.info.data.map((b: IKuCoinBalance) => ({
        coin: b.currency,
        free: b.available,
        total: b.balance
      }));
    case ExchangeId.Kraken:
      return Object.keys(balances.total).map((coin) => ({
        coin: coin,
        free: balances[coin].free ? balances[coin].free : balances[coin].total,
        total: balances[coin].total
      }));
    case ExchangeId.FTX:
    default:
      return balances.info.result
        .filter((b: IFTXBalance) => Number(b.total))
        .map((b: IFTXBalance) => ({
          coin: b.coin,
          free: b.free,
          total: b.total
        }));
  }
};
