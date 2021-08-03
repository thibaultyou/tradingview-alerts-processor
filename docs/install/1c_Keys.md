# Configure exchanges API keys

- Register API keys in the app (using for example FTX as an exchange)
  - Create a [FTX](https://ftx.com/) account (or subaccount)
  - Login and go to Preferences > Api > __Create a key pair__
  - Open a local terminal session

- Register **FTX** main account under the stub `main` :

    ```sh
    curl -d '{"stub": "main", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts -H 'Content-Type: application/json; charset=utf-8'
    ```

- Register **FTX** subaccount named `testing` under the stub `sub` :

    ```sh
    curl -d '{"stub": "sub", "subaccount":"testing", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts -H 'Content-Type: application/json; charset=utf-8'
    ```

- Register **KuCoin** main account under the stub `kuc` :

    ```sh
    curl -d '{"stub": "kuc", "exchange":"kucoin", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY", "passphrase": "YOUR_TRADING_PASSPHRASE" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts -H 'Content-Type: application/json; charset=utf-8'
    ```

Available id for exchanges are listed [here](https://github.com/thibaultyou/tradingview-alerts-processor#readme).