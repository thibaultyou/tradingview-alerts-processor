import WebSocket from 'ws';
import * as crypto from 'crypto';
import { Account } from '../../../entities/account.entities';
import { getFTXBaseSymbol } from '../../../utils/exchanges/ftx.utils';

interface ISocket {
  ws: WebSocket;
  subs: Array<Record<string, any>>;
}

export interface IFTXWSTicker {
  bid: number;
  ask: number;
  // bidSize: number;
  // askSize: number;
  // last: number;
  time: number;
}

const DEFAULT_SOCKET = 'public';

export class FTXExchangeWSService {
  sockets: Record<string, ISocket> = {
    [DEFAULT_SOCKET]: {
      ws: new WebSocket('wss://ftx.com/ws/', {
        perMessageDeflate: false
      }),
      subs: []
    }
  }; // account id / privates sockets
  tickers: Record<string, IFTXWSTicker> = {}; // ticker symbol / ticker

  static init = async (): Promise<FTXExchangeWSService> => {
    const ws = new FTXExchangeWSService()
    await ws.connect(ws.sockets[DEFAULT_SOCKET].ws);
    console.log(`Opening FTX public socket.`);
    return ws;
  }

  send = (ws: WebSocket, message: Record<string, any>, account?: Account) => {
    if (message.op === 'subscribe') {
      this.sockets[account ? account.stub : DEFAULT_SOCKET].subs.push(message);
    } else if (message.op !== 'ping') {
      console.log(message);
    }
    ws.send(JSON.stringify(message));
  };

  connect = (ws: WebSocket, account?: Account): Promise<void> => {
    return new Promise((resolve, _reject) => {
      ws.onopen = () => {
        setInterval(() => this.send(ws, { op: 'ping' }), 5 * 1000);
        resolve();
      };

      ws.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data.toString());
        } catch (e) {
          console.error('FTX sent a bad json', e.data);
        }
        switch (msg.channel) {
          case 'ticker':
            this.tickers[getFTXBaseSymbol(msg.market)] = msg.data
            break;
          // case 'orders':
          // case 'fills':
          default:
            break;
        }
      };

      ws.onclose = (event) => {
        console.log('Socket is closed. Reconnecting ...', event.reason);
        this.connect(ws, account);
      };

      ws.onerror = (err) => {
        console.error(
          'Socket encountered error: ',
          err.message,
          'Closing socket'
        );
        ws.close();
      };
    });
  };

  addAccount = async (account: Account): Promise<void> => {
    const ws = new WebSocket('wss://ftx.com/ws/', {
      perMessageDeflate: false
    });
    this.sockets[account.stub] = {
      ws,
      subs: []
    };
    await this.connect(this.sockets[account.stub].ws, account);
    const { apiKey, secret, stub, subaccount } = account;
    const time = Date.now();
    const sign = crypto
      .createHmac('sha256', secret)
      .update(time + 'websocket_login')
      .digest('hex');
    this.send(
      ws,
      {
        op: 'login',
        args: {
          key: apiKey,
          sign: sign,
          time: time,
          subaccount: subaccount
        }
      },
      account
    );
    // this.send(ws, { op: 'subscribe', channel: 'fills' }, account);
    // this.send(ws, { op: 'subscribe', channel: 'orders' }, account);
    console.log(`Opening FTX socket for ${stub} account.`);
  };

  addTicker = (symbol: string): void => {
    if (!this.tickers[symbol]) {
      this.send(this.sockets[DEFAULT_SOCKET].ws, {
        op: 'subscribe',
        channel: 'ticker',
        market: symbol
      });
    }
  };
}
