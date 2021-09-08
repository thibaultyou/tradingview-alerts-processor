# TradingView alerts processor

[![Docker build status](https://img.shields.io/docker/cloud/build/madamefleur/tradingview-alerts-processor)](https://hub.docker.com/repository/docker/madamefleur/tradingview-alerts-processor) &nbsp; [![Docker image size](https://img.shields.io/docker/image-size/madamefleur/tradingview-alerts-processor)](https://hub.docker.com/repository/docker/madamefleur/tradingview-alerts-processor/tags?page=1&ordering=last_updated)

>
> This project is under construction 🚧
> Only USD based markets are supported for now
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

| logo                                                                                                                                                                               | id            | name                                                                        | doc                                                                |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----------------------------------------------------------------------------|:------------------------------------------------------------------:|
| [![binance](https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg)](https://www.binance.com/) | binance | [Binance (spot)](https://www.binance.com/) | [API](https://binance-docs.github.io/apidocs/spot/en)              |
| [![binanceusdm](https://user-images.githubusercontent.com/1294454/117738721-668c8d80-b205-11eb-8c49-3fad84c4a07f.jpg)](https://www.binance.com/) | binanceusdm | [Binance USDⓈ-M (futures)](https://www.binance.com/) | [API](https://binance-docs.github.io/apidocs/spot/en)              |
| [![binanceus](https://user-images.githubusercontent.com/1294454/65177307-217b7c80-da5f-11e9-876e-0b748ba0a358.jpg)](https://www.binance.us)                                        | binanceus          | [Binance US](https://www.binance.us)                                      | [API](https://github.com/binance-us/binance-official-api-docs)                              |
| [![ftx](https://user-images.githubusercontent.com/1294454/67149189-df896480-f2b0-11e9-8816-41593e17f9ec.jpg)](https://ftx.com/) | ftx | [FTX (spot & futures)](https://ftx.com/) | [API](https://github.com/ftexchange/ftx) |
| [![kucoin](https://user-images.githubusercontent.com/51840849/87295558-132aaf80-c50e-11ea-9801-a2fb0c57c799.jpg)](https://www.kucoin.com/) | kucoin | [KuCoin (spot)](https://www.kucoin.com/) | [API](https://docs.kucoin.com) |
| [![kraken](https://user-images.githubusercontent.com/51840849/76173629-fc67fb00-61b1-11ea-84fe-f2de582f58a3.jpg)](https://www.kraken.com) | kraken | [Kraken (spot)](https://www.kraken.com) | [API](https://www.kraken.com/features/api)                                                  |
<!-- | [![binancecoinm](https://user-images.githubusercontent.com/1294454/117738721-668c8d80-b205-11eb-8c49-3fad84c4a07f.jpg)](https://www.binance.com/)                     | binancecoinm  | [Binance COIN-M](https://www.binance.com/)                     | *   | [API](https://binance-docs.github.io/apidocs/spot/en)              |-->

### 🚧 Features

- add / read / delete account (or subaccount for FTX) configuration
- open a Long / Short position (Futures) or Buy / Sell a token (Spot) in $US
- open a Long / Short position (Futures) or Buy / Sell a token (Spot) with a percentage of your available account collateral / balance
- close a position or a percentage of it
- set a maximum budget (for a coin on Futures / for account on Spot)
- list account(s) balances
- list configured account(s)
- list exchange markets
- process multiple trades at once

<!-- - close a position and open another in the opposite direction (Futures only)
- close a position while reducing on oversell / overbuy (Futures only) -->

### 💡 Contributions

Feel free to submit [Github issues](https://github.com/thibaultyou/tradingview-alerts-processor/issues) if you find anything you want me to add, fix or improve.

Best way to show your support to this tool is by hitting the star button [![Stars](https://img.shields.io/github/stars/thibaultyou/tradingview-alerts-processor?style=social)](https://github.com/thibaultyou/tradingview-alerts-processor/stargazers), you can also [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/thibaultyou).

You can join us on the Jackrabbit Discord server [![Discord](https://img.shields.io/discord/664206005881536512)](https://discord.gg/mNMVWXpAGd) where I'll be happy to answer questions there, you'll also find great strategies to use with this tool.