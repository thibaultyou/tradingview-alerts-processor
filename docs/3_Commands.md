# Available commands examples

>
> Since the trade executor is decoupled from the requests you can't know if the trade has been successfully processed without checking the logs, I strongly recommand to check those during your alerts setup/testing phase.
>

- __Add main account__ under the stub `main` :

    ```sh
    curl -d '{"stub": "MAIN", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Add subaccount__ named `testing` under the stub `sub` :

    ```sh
    curl -d '{"stub": "sub", "subaccount":"testing", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Remove account__ under the stub `sub` :

    ```sh
    curl -X DELETE http://YOUR.STATIC.IP.ADDRESS/accounts/sub
    ```

- __Open a long position__ of 11$ on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "long" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Open a short position__ a 11$ on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "short" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Open a long position__ with 5% of available collateral (Futures) or available balance (Spot) on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "size": "5%", "direction": "long" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Open a short position__ with 5% of available collateral (Futures) or available balance (Spot) on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "size": "5%", "direction": "short" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Set a maximum budget__ and __open a long position__ of 11$ on ETH-PERP using `test` account (order will not be processed if requested size + current opened size is greater than maximum size) :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "long", "max": "1000" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Close 100% of a position__ (short or long) on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "close" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Close XX% of a position__ (short or long) on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "close", "size": "33%" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __List balances__ on `sub` account :

    ```sh
    curl -X GET http://YOUR.STATIC.IP.ADDRESS/balances/sub
    ```

- __List configured accounts__ :

    ```sh
    curl -X GET http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

- __List balances__ on all configured accounts :

    ```sh
    curl -X GET http://YOUR.STATIC.IP.ADDRESS/balances
    ```

- __List available markets__ on a specific exchange :

    ```sh
    curl -X GET http://YOUR.STATIC.IP.ADDRESS/markets/ftx
    ```

- __Process multiple trades__ at once :

    ```sh
    curl -d '[{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "long" }, {"stub": "test", "symbol": "BTC-PERP", "size": "11", "direction": "long" }]' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

<!-- 
- __Close a short position__ and __open a long position__ on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "long", "size": "11", "mode": "reverse" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Close a long position__ and __open a short position__ on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "short", "size": "11", "mode": "reverse" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Close a short position__ (for example 80$US) while reducing with __a long position__ (100$US) on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "long", "size": "100", "mode": "overflow" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Close a long position__ (for example 80$US) while reducing with __a short position__ (100$US) on ETH-PERP using `test` account :

    ```sh
    curl -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "short", "size": "100", "mode": "overflow" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ``` -->