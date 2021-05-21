# TradingView alerts processor

Minimalist service designed to execute TradingView webhooks and process them to [FTX](https://ftx.com/) and [Binance](https://www.binance.com/fr/futures) exchanges.

## Motivations

I was using [frostybot-js](https://github.com/CryptoMF/frostybot-js) for a long time but sometimes the service is crashing or not performing well if multiples alerts are received at the same time. I need for my personnal use something fast and reliable for trading or I will lose money and opportunities.

As this tool is designed for my own usage, I will not provide any form of support to improve it.

## TODO list

- [x] Basic server
- [ ] Command processor
- [x] Webhooks processor
- [ ] Accounts handler
- [x] FTX integration
- [ ] Binance integration
- [ ] IP filtering
- [x] DB for storing API keys / secrets
- [ ] Usage
- [ ] Improve error handling
- [ ] Improve logging
- [ ] Add relative / percent position sizing
- [ ] Tests / coverage

## Installation

- [ ] AWS lightsail instance - Node version
- [ ] Static IP
- [ ] Bitnami routing
- [ ] TradingView setup

## Credits

Inspired by [frostybot-js](https://github.com/CryptoMF/frostybot-js)