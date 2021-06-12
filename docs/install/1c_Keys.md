# Configure exchanges API keys

- Register API keys in the app (using for example FTX as an exchange)
  - Create a [FTX](https://ftx.com/) account (or subaccount)
  - Login and go to Preferences > Api > __Create a key pair__
  - Open a local terminal session

- Register main account under the stub `main` :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "MAIN", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

- Register subaccount named `testing` under the stub `sub` :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "sub", "subaccount":"testing", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts
    ```