# TradingView alerts processor

>
> This project is under construction 🚧
>

Minimalist service designed to execute [TradingView](https://www.tradingview.com/) webhooks and process them to cryptocurrencies exchanges from [AWS lightsail](https://lightsail.aws.amazon.com/).

Current features :

- add/read/delete account/subaccount configuration
- open a Long/Short position in dollars
- close an open position or a fraction of it
- list available balances
- list available markets

🚧 Coming soon :

- leverage config for Binance
- AWS container service install
- better logging system
- relative account position sizing
- storage upgrade
- max buy quantity
- reverse an open position side
- Kucoin support
- Kraken support
- limit orders
- more metrics
- web UI

### Supported exchanges

| logo                                                                                                                                                                               | id            | name                                                                        | ver | doc                                                                |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----------------------------------------------------------------------------|:---:|:------------------------------------------------------------------:|
| [![binance](https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg)](https://www.binance.com/?ref=10205187)                           | binance       | [Binance](https://www.binance.com/?ref=10205187)                            | *   | [API](https://binance-docs.github.io/apidocs/spot/en)              |
| [![ftx](https://user-images.githubusercontent.com/1294454/67149189-df896480-f2b0-11e9-8816-41593e17f9ec.jpg)](https://ftx.com/#a=1623029)                                          | ftx           | [FTX](https://ftx.com/#a=1623029)                                           | *   | [API](https://github.com/ftexchange/ftx)                           |
| [![binanceusdm](https://user-images.githubusercontent.com/1294454/117738721-668c8d80-b205-11eb-8c49-3fad84c4a07f.jpg)](https://www.binance.com/?ref=10205187)                      | binanceusdm   | [Binance USDⓈ-M](https://www.binance.com/?ref=10205187)                     | *   | [API](https://binance-docs.github.io/apidocs/spot/en)              | 
<!-- | [![binancecoinm](https://user-images.githubusercontent.com/1294454/117738721-668c8d80-b205-11eb-8c49-3fad84c4a07f.jpg)](https://www.binance.com/?ref=10205187)                     | binancecoinm  | [Binance COIN-M](https://www.binance.com/?ref=10205187)                     | *   | [API](https://binance-docs.github.io/apidocs/spot/en)              |-->


### Installation

Choose your method and follow steps described here :

- [Recommended - Installation using AWS lightsail - Docker](docs/install/1b_Docker.md).
- [Installation using AWS lightsail - Nodejs](docs/install/1a_Node.md).

then you can [configure exchanges api keys](docs/install/1c_Keys.md).

### Usage

You can use the bot with :

- [Tradingview alerts / webhooks system](docs/2_Alerts.md)
- [HTTP requests](docs/3_Commands.md)

### Contributions

Feel free to submit [Github issues](https://github.com/thibaultyou/tradingview-alerts-processor/issues) if you find anything you want me to add, fix or improve.
