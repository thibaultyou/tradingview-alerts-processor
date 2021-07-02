# TradingView alerts processor

[![Docker build status](https://img.shields.io/docker/cloud/build/madamefleur/tradingview-alerts-processor)](https://hub.docker.com/repository/docker/madamefleur/tradingview-alerts-processor) &nbsp; [![Docker image size](https://img.shields.io/docker/image-size/madamefleur/tradingview-alerts-processor)](https://hub.docker.com/repository/docker/madamefleur/tradingview-alerts-processor/tags?page=1&ordering=last_updated)

>
> This project is under construction 🚧
>

Minimalist service designed to execute [TradingView](https://www.tradingview.com/) webhooks and process them to cryptocurrencies exchanges from [AWS lightsail](https://lightsail.aws.amazon.com/).

### 📦 Installation

Choose install your method and follow steps :

- [Recommended - AWS lightsail with Docker](docs/install/1b_Docker.md)
- [AWS lightsail with Nodejs](docs/install/1a_Node.md)

then you can [configure exchanges api keys](docs/install/1c_Keys.md).

### 🚀 Usage

You can use the bot with :

- [Tradingview alerts / webhooks system](docs/2_Alerts.md)
- [HTTP requests](docs/3_Commands.md)

### 🏦 Supported exchanges

| logo                                                                                                                                                                               | id            | name                                                                        | ver | doc                                                                |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----------------------------------------------------------------------------|:---:|:------------------------------------------------------------------:|
| [![binance](https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg)](https://www.binance.com/)                           | binance       | [Binance](https://www.binance.com/)                            | *   | [API](https://binance-docs.github.io/apidocs/spot/en)              |
| [![binanceusdm](https://user-images.githubusercontent.com/1294454/117738721-668c8d80-b205-11eb-8c49-3fad84c4a07f.jpg)](https://www.binance.com/)                      | binanceusdm   | [Binance USDⓈ-M](https://www.binance.com/)                     | *   | [API](https://binance-docs.github.io/apidocs/spot/en)              | 
| [![ftx](https://user-images.githubusercontent.com/1294454/67149189-df896480-f2b0-11e9-8816-41593e17f9ec.jpg)](https://ftx.com/)                                          | ftx           | [FTX](https://ftx.com/)                                           | *   | [API](https://github.com/ftexchange/ftx)                           |
<!-- | [![binancecoinm](https://user-images.githubusercontent.com/1294454/117738721-668c8d80-b205-11eb-8c49-3fad84c4a07f.jpg)](https://www.binance.com/)                     | binancecoinm  | [Binance COIN-M](https://www.binance.com/)                     | *   | [API](https://binance-docs.github.io/apidocs/spot/en)              |-->

### 🚧 Features

- add / read / delete account (or subaccount for FTX) configuration
- open a Long / Short position (futures) or Buy / Sell a token (spot) in $US or with a percentage of your account collateral / balance
- close a position or a percentage of it
- close a position and open another in the opposite direction (Futures only)
- close a position while reducing on oversell / overbuy (Futures only)
- set a maximum budget (for a coin on Futures / for account on Spot)
- list account balances
- list exchange markets

Coming soon :

- CLI
- trading modes for spot markets
- leverage config for Binance
- additional tickers / account and exchanges checks
- AWS container service install
- missing endpoints : logs, orders, positions
- better logging system
- Kucoin support
- Kraken support
- limit orders
- multiple commands at once
- more metrics
- web UI

### 💡 Contributions

Feel free to submit [Github issues](https://github.com/thibaultyou/tradingview-alerts-processor/issues) if you find anything you want me to add, fix or improve.
