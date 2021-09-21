
# TradingView Alerts Processor



## Indices

* [Accounts](#accounts)

  * [Add account](#1-add-account)
  * [Get account](#2-get-account)
  * [List configured accounts](#3-list-configured-accounts)
  * [Remove account](#4-remove-account)

* [Balances](#balances)

  * [List account balances](#1-list-account-balances)
  * [List balances on all configured accounts](#2-list-balances-on-all-configured-accounts)

* [Health](#health)

  * [Check server health](#1-check-server-health)

* [Markets](#markets)

  * [List available markets](#1-list-available-markets)

* [Trades](#trades)

  * [Close a position](#1-close-a-position)
  * [Open a position](#2-open-a-position)
  * [Process multiple trades at once](#3-process-multiple-trades-at-once)


--------


## Accounts



### 1. Add account



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: YOUR.STATIC.IP.ADDRESS/accounts
```



***Body:***

```js        
{
    "stub": "{{account_alias}}",
    "exchange": "{{exchange_id}}",
    "apiKey": "{{exchange_api_key}}",
    "secret": "{{exchange_api_secret}}"
}
```



***More example Requests/Responses:***


##### I. Example Request: Main account


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Body:***

```js        
{
    "stub": "{{account_alias}}",
    "exchange": "{{exchange_id}}",
    "apiKey": "{{exchange_api_key}}",
    "secret": "{{exchange_api_secret}}"
}
```



***Status Code:*** 0

<br>



##### II. Example Request: FTX subaccount


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Body:***

```js        
{
    "stub": "{{account_alias}}",
    "subaccount": "{{subaccount_alias}}",
    "exchange": "ftx",
    "apiKey": "{{exchange_api_key}}",
    "secret": "{{exchange_api_secret}}"
}
```



***Status Code:*** 0

<br>



##### III. Example Request: KuCoin account


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Body:***

```js        
{
    "stub": "{{account_alias}}",
    "exchange": "kucoin",
    "apiKey": "{{exchange_api_key}}",
    "secret": "{{exchange_api_secret}}",
    "passphrase": "{{exchange_api_passphrase}}"
}
```



***Status Code:*** 0

<br>



### 2. Get account



***Endpoint:***

```bash
Method: GET
Type: 
URL: YOUR.STATIC.IP.ADDRESS/accounts
```



### 3. List configured accounts



***Endpoint:***

```bash
Method: GET
Type: 
URL: YOUR.STATIC.IP.ADDRESS/accounts
```



### 4. Remove account



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: YOUR.STATIC.IP.ADDRESS/accounts/MAIN
```



## Balances



### 1. List account balances



***Endpoint:***

```bash
Method: GET
Type: 
URL: YOUR.STATIC.IP.ADDRESS/balances/MAIN
```



### 2. List balances on all configured accounts



***Endpoint:***

```bash
Method: GET
Type: 
URL: YOUR.STATIC.IP.ADDRESS/balances
```



## Health



### 1. Check server health



***Endpoint:***

```bash
Method: GET
Type: 
URL: YOUR.STATIC.IP.ADDRESS/health
```



## Markets



### 1. List available markets



***Endpoint:***

```bash
Method: GET
Type: 
URL: YOUR.STATIC.IP.ADDRESS/markets/ftx
```



## Trades



### 1. Close a position



***Endpoint:***

```bash
Method: POST
Type: 
URL: YOUR.STATIC.IP.ADDRESS/trades
```



***More example Requests/Responses:***


##### I. Example Request: Close 100% of a position


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Status Code:*** 0

<br>



##### II. Example Request: Close XX% of a position


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Body:***

```js        
{
    "stub": "test",
    "symbol": "ETH-PERP",
    "direction": "close",
    "size": "33%"
}
```



***Status Code:*** 0

<br>



### 2. Open a position



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: YOUR.STATIC.IP.ADDRESS/trades
```



***Body:***

```js        
{
    "stub": "test",
    "symbol": "ETH-PERP",
    "size": "11",
    "direction": "short"
}
```



***More example Requests/Responses:***


##### I. Example Request: Long position


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Body:***

```js        
{
    "stub": "test",
    "symbol": "ETH-PERP",
    "size": "11",
    "direction": "long"
}
```



***Status Code:*** 0

<br>



##### II. Example Request: Short position


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Body:***

```js        
{
    "stub": "test",
    "symbol": "ETH-PERP",
    "size": "11",
    "direction": "short"
}
```



***Status Code:*** 0

<br>



##### III. Example Request: Long position with XX% of available collateral (Futures) or available balance (Spot)


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Body:***

```js        
{
    "stub": "test",
    "symbol": "ETH-PERP",
    "size": "5%",
    "direction": "long"
}
```



***Status Code:*** 0

<br>



##### IV. Example Request: Short position with XX% of available collateral (Futures) or available balance (Spot)


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |
| charset | utf-8 |  |



***Body:***

```js        
{
    "stub": "test",
    "symbol": "ETH-PERP",
    "size": "5%",
    "direction": "short"
}
```



***Status Code:*** 0

<br>



### 3. Process multiple trades at once



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: YOUR.STATIC.IP.ADDRESS/trades
```



***Body:***

```js        
[
    {
        "stub": "test",
        "symbol": "ETH-PERP",
        "size": "11",
        "direction": "long"
    },
    {
        "stub": "test",
        "symbol": "BTC-PERP",
        "size": "11",
        "direction": "long"
    }
]
```



***Available Variables:***

| Key | Value | Type |
| --- | ------|-------------|
| server_ip | YOUR.STATIC.IP.ADDRESS |  |
| account_alias | MAIN |  |
| subaccount_alias |  |  |
| exchange_id | ftx |  |
| exchange_api_key | YOUR_API_KEY |  |
| exchange_api_secret | YOUR_API_SECRET |  |
| exchange_api_passphrase | YOUR_KUCOIN_PASSPHRASE |  |



---
[Back to top](#tradingview-alerts-processor)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2021-09-21 17:48:47 by [docgen](https://github.com/thedevsaddam/docgen)
