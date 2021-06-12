# Setup TradingView alerts

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

    - Close 100% of a position :

        ```json
        { "stub": "dev", "direction": "close", "symbol": "ETH-PERP" }
        ```

    - Close a fraction of a position in percent (⚠️ WATCH OUT, the fraction must be greater or equal than the minimum tradable amount set by the exchange for the pair ! Size must be between 1 and 100 with a percent sign, otherwise 100% will be closed) :

        ```json
        { "stub": "dev", "direction": "close", "symbol": "ETH-PERP", "size": "50%" }
        ```