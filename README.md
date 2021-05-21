# TradingView alerts processor

>
> This project is under construction 🚧
>

Minimalist service designed to execute [TradingView](https://www.tradingview.com/) webhooks and process them to [FTX](https://ftx.com/) and [Binance](https://www.binance.com/fr/futures) exchanges.

## Index

<!-- toc -->

- [Motivations](#motivations)
- [Installation](#installation)
  * [Step 1 - AWS lightsail setup](#step-1---aws-lightsail-setup)
  * [Step 2 - SSH access](#step-2---ssh-access)
  * [Step 3 - Install and configure app](#step-3---install-and-configure-app)
  * [Step 4 - Exchanges API keys](#step-4---exchanges-api-keys)
  * [Step 5 - Setup TradingView alerts](#step-5---setup-tradingview-alerts)
- [Optional commands](#optional-commands)
- [TODO list](#todo-list)
- [Credits](#credits)

<!-- tocstop -->

## Motivations

I was using [frostybot-js](https://github.com/CryptoMF/frostybot-js) for a long time but sometimes the service is crashing or not performing well if multiples alerts are received at the same time, this tool does not pretend to be better than forstybot but it fixes those issues. I need for my personnal use something fast and reliable for trading or I will lose money and opportunities.

As this tool is designed for my own usage, I will not provide any form of support to improve it.

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
    
    ```
    chmod 400 ~/Downloads/key.pem
    ```
    
    - SSH to your instance using the downloaded key like this (you can find the 
    username/ip by selecting your instance [here](https://lightsail.aws.amazon.com/ls/webapp/home/instances)) :
    
    ```
    ssh USERNAME@YOUR.STATIC.IP.ADDRESS -i ~/Downloads/key.pem
    ```

    - If everything is ok at this point you should successfully log into your instance
    - Update packages and restart your instance with this :
    
    ```
    sudo apt update -y && sudo apt upgrade -y && sudo reboot
    ```

### Step 3 - Install and configure app

> If your Node.js instance is a Bitnami this is fine

- Log back in your instance with :

    ```
    ssh USERNAME@YOUR.STATIC.IP.ADDRESS -i ~/Downloads/key.pem
    ```

- Clone the app sources :

    ```
    git clone https://github.com/thibaultyou/tradingview-alerts-processor.git
    ```

- Install dependencies :

    ```
    cd tradingview-alerts-processor/
    npm i
    sudo npm i -g pm2
    sudo pm2 install typescript
    ```

- Configure Apache :

    ```
    sudo cp /opt/bitnami/apache/conf/vhosts/sample-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-vhost.conf
    sudo cp /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf
    sudo /opt/bitnami/ctlscript.sh restart apache
    ```

- Configure and launch app with [pm2](https://pm2.keymetrics.io/) and save process :

    ```
    pm2 startup
    sudo env PATH=$PATH:/opt/bitnami/node/bin /opt/bitnami/node/lib/node_modules/pm2/bin/pm2 startup systemd -u bitnami --hp /home/bitnami
    pm2 start server.ts --watch
    pm2 save
    ```

- If you want to check logs :

    ```
    pm2 logs server
    ```

- If you want to check trades only :

    ```
    tail -f logs/trades.log
    ```

- To update the app from the source directory :

    ```
    pm2 stop
    git pull
    npm i
    pm2 start
    ```

### Step 4 - Exchanges API keys

- Register API keys in the app
  - Create a [FTX](https://ftx.com/) account (or subaccount)
  - Login and go to Preferences > Api > __Create a key pair__
  - Open a local terminal session

- Register main account under the stub `main` :

    ```
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "MAIN", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

- Register subaccount named "testing" under the stub `sub` :

    ```
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "sub", "subaccount":"testing", "exchange":"ftx", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

### Step 5 - Setup TradingView alerts

- Create a TradingView account
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

## Optional commands

- __Remove an account__ under the stub `sub`:

    ```
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "sub" }' -X DELETE http://YOUR.STATIC.IP.ADDRESS/accounts
    ```

- __List balances__ on `sub` account  :

    ```
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "sub" }' -X GET http://YOUR.STATIC.IP.ADDRESS/balances
    ```

- Open a 11$ __long__ position on ETH-PERP using `test` account :

    ```
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "long"}' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

- Open a 11$ __short__ position on ETH-PERP using `test` account :

    ```
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "size": "11", "direction": "short"}' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

- __Close 100%__ of a position (short or long) on ETH-PERP using `test` account :

    ```
    curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ETH-PERP", "direction": "close"}' -X POST http://YOUR.STATIC.IP.ADDRESS/trades
    ```

## TODO list

- [x] Basic server
- [ ] Command processor
- [x] Webhooks processor
- [x] Accounts handler
- [x] FTX integration
- [ ] Binance integration
- [ ] IP filtering
- [x] DB for storing API keys / secrets
- [x] Usage
- [ ] Improve error handling
- [x] Improve logging
- [ ] Add relative / percent position sizing
- [ ] Tests / coverage
- [ ] Check if account is valid at save
- [ ] List available markets route
- [ ] Add partial position close
- [ ] Improve validators

## Credits

Inspired by [frostybot-js](https://github.com/CryptoMF/frostybot-js)