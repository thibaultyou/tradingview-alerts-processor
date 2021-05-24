# TradingView alerts processor

>
> This project is under construction 🚧
>

Minimalist service designed to execute [TradingView](https://www.tradingview.com/) webhooks and process them to [FTX](https://ftx.com/) and [Binance](https://www.binance.com/fr/futures) exchanges.

## Index

<!-- toc -->

- [Features](#features)
- [Contributions](#contributions)
- [Installation](#installation)
  - [Step 1 - AWS lightsail setup](#step-1---aws-lightsail-setup)
  - [Step 2 - SSH access](#step-2---ssh-access)
  - [Step 3 - Install and configure app](#step-3---install-and-configure-app)
  - [Step 4 - Exchanges API keys](#step-4---exchanges-api-keys)
  - [Step 5 - Setup TradingView alerts](#step-5---setup-tradingview-alerts)
  - [Optional steps](#optional-steps)
- [Available API commands](#available-api-commands)
- [TODO list](#todo-list)
- [Motivations](#motivations)
- [Credits](#credits)

<!-- tocstop -->

## Features

- FTX support
  - Add/Read/Delete account/subaccount configuration
  - Open a Long/Short position in dollars
  - Close 100% of an open position
  - List available balances

## Contributions

Feel free to submit [Github issues](https://github.com/thibaultyou/tradingview-alerts-processor/issues) if you find anything you want me to add, fix or improve.

## Installation

### Step 1 - AWS lightsail setup

- Create a [AWS lightsail](https://lightsail.aws.amazon.com/) account

- Deploy an VPS instance
  - Go to [AWS lightsail > Intances](https://lightsail.aws.amazon.com/ls/webapp/home/instances)
  - Select [Create instance](https://lightsail.aws.amazon.com/ls/webapp/create/instance)
  - Select Linux/Unix > Apps + OS > __Node.js__
  - Name it like you want
  - Validate creation

- Add a static IP
  - Go to [AWS lightsail > Networking](https://lightsail.aws.amazon.com/ls/webapp/home/networking)
  - Select [Create static IP](https://lightsail.aws.amazon.com/ls/webapp/create/static-ip)
  - Attach it to your instance
  - Name it like you want
  - Validate creation

### Step 2 - SSH access

- Create SSH key pairs
  - Go to [AWS lightsail > SSH keys](https://lightsail.aws.amazon.com/ls/webapp/account/keys)
  - Select default key
  - Download the `.pem` file (let's pretend that you saved it here `~/Downloads/key.pem`)

- Test your access
  - Open a local terminal session
  - Adjust your key rights with this :

    ```sh
    chmod 400 ~/Downloads/key.pem
    ```

### Step 3 - Install and configure app

>
> Your Node.js instance must be a [Bitnami one](https://aws.amazon.com/marketplace/pp/B00NNZUAKO)
>

- SSH to your instance using the downloaded key like this (you can find the
    username/ip by selecting your instance [here](https://lightsail.aws.amazon.com/ls/webapp/home/instances)) :

    ```sh
    ssh USERNAME@YOUR.STATIC.IP.ADDRESS -i ~/Downloads/key.pem
    ```

- Clone the app sources :

    ```sh
    git clone https://github.com/thibaultyou/tradingview-alerts-processor.git
    ```

- Install app and configure the server :

    ```sh
    cd tradingview-alerts-processor/
    sudo sh install.sh
    ```

### Step 4 - Exchanges API keys

- Register API keys in the app
  - Create a [FTX](https://ftx.com/) account (or subaccount)
  - Login and go to Preferences > Api > __Create a key pair__
  - Open a local terminal session

- Register main account under the stub `main` :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "MAIN", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

- Register subaccount named "testing" under the stub `sub` :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "sub", "subaccount":"testing", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

### Step 5 - Setup TradingView alerts

- Create a [TradingView](https://www.tradingview.com/) account
  - Go to a chart
  - Add an alert
- Configure alert
  - Setup your condition
  - Webhook url : `http://YOUR.STATIC.IP.ADDRESS/trades`
  - Message should have this structure :
    - Long position :

        ```json
        { "stub": "dev", "direction": "long", "symbol": "ETH-PERP", "size": "50" }
        ```

    - Short position :

        ```json
        { "stub": "dev", "direction": "short", "symbol": "ETH-PERP", "size": "50" }
        ```

    - Close position :

        ```json
        { "stub": "dev", "direction": "close", "symbol": "ETH-PERP" }
        ```

### Optional steps

>
> For those steps you need to be logged in your instance, see the first command in [Step 3 - Install and configure app](#step-3---install-and-configure-app)
>

- If you want to check logs :

    ```sh
    pm2 logs server
    ```

- If you want to check trades only :

    ```sh
    tail -f logs/trades.log
    ```

- To update the app :

    ```sh
    cd tradingview-alerts-processor/
    sudo sh update.sh
    ```

## Available API commands

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

- __Open a long position__ of 11$ on ETH-PERP using `test` account :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "long"}' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

- __Open a short position__ a 11$ on ETH-PERP using `test` account :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "short"}' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

- __Close 100% of a position__ (short or long) on ETH-PERP using `test` account :

    ```sh
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "close"}' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

## TODO list

- [ ] Command processor
- [ ] Binance integration
- [ ] IP filtering
- [ ] Improve error handling
- [ ] Add relative / percent position sizing
- [ ] Tests / coverage
- [ ] Check if account is valid at save
- [ ] List available markets route
- [ ] Add partial position close
- [ ] Improve validators

## Motivations

I was using [frostybot-js](https://github.com/CryptoMF/frostybot-js) for a while but sometimes the service was crashing or not performing well if multiples alerts were received at the same time, this tool does not pretend to be better than frostybot but it fixes those issues. I need for my personnal use something fast and reliable for trading or I will lose money and opportunities.

## Credits

Inspired by [frostybot-js](https://github.com/CryptoMF/frostybot-js)
