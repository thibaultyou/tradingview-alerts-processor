# Available commands

>
> Since the trade executor is decoupled from the requests you can't know if the trade has been successfully processed without checking the logs, I strongly recommand to check those during your alerts setup/testing phase.
>

- __Add main account__ under the stub `main` :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "MAIN", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

- __Add subaccount__ named `testing` under the stub `sub` :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "sub", "subaccount":"testing", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

- __Remove account__ under the stub `sub`:

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "sub" }' -X DELETE http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

- __List balances__ on `sub` account  :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "sub" }' -X GET http://YOUR.STATIC.IP.ADDRESS/balances
    ```

- __List available markets__ on a specific exchange  :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"exchange": "ftx" }' -X GET http://YOUR.STATIC.IP.ADDRESS/markets
    ```

- __Open a long position__ of 11$ on ETH-PERP using `test` account :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "long" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

- __Open a long position__ of 11$ on ETH-PERP using `test` account with a maximum current position quantity (order will not be processed if requested size + current opened size is greater than maximum size) :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "long", "max": "1000" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

- __Open a short position__ a 11$ on ETH-PERP using `test` account :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "short" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

- __Close 100% of a position__ (short or long) on ETH-PERP using `test` account :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "close" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

- __Close XX% of a position__ (short or long) on ETH-PERP using `test` account :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "close", "size": "33%" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```