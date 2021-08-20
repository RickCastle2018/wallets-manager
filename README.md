# wallets-manager

`v0.1.0` — beta (in development, wait for release)

1. Install Docker, enable it in systemctl
2. Clone repo
3. Run `docker-compose up -d -restart=always`

## API

API methods documentation.

All questions: @nikonovcc in Telegram

### Access API

At `localhost:2311/…`

### API Methods

There are two kinds of managed wallets in system:

* round-wallets — `/round-wallet/{method}` — type of wallets which used for *deposits* in games. Game has only one round wallet.
* user-wallets — `/user/{user-id}/{method}` — type of wallets which every user has, this wallet is users' game account

*Notice*: all query examples are JSON which you have to send in POST-data to service

#### round-wallet methods

Interact with round wallets

##### `GET /round-wallet`

Return games' round-wallet blockchain address and balance.

Example response:

```js
{
    blockchain_address: string,
    balance: float
}
```

##### `POST /round-wallet/withdraw`

Withdraw money from round-wallet to user-wallet

Example query:

```js
{
    amount: float,
    to: int // user id in game database
}
```

Example response:

```js
{
    successful: bool,
    error: string // returned if there was an error
}
```

##### `POST /round-wallet/deposit`

Send (enter deposit) money from user-wallet to round-wallet

Example query:

```js
{
    amount: float,
    from: int // user id in game database
}
```

Example response:

```js
{
    successful: bool,
    error: string // returned if there was an error
}
```

#### user-wallets methods

API methods to interact with user-wallets

##### `POST /user/{user_id}`

Create user-wallet

`{user_id}` — users' id in *game* database (it will be the same). Create user-wallet linkedto his id in game database.

Example response:

```js
{   
    success: bool,
    blockchain_address: string,
}
```

##### `GET /user/{user_id}`

Get user data (balance & blockchain address)

`{user_id}` — users' id in *game* database (it will be the same).
Return user-wallet blockchain address and balance.

Example response:

```js
{   
    blockchain_address: string,
    balance: float
}
```

##### `GET /user/{user_id}/transactions`

Will be implemented after beta

<!-- `{user_id}` — users' id in *game* database (it will be the same).
Return user-wallet transactions history.

Example response:

```js
{   
    transactions: [
        {
            TRANSACTION JSON
        },
        …
    ]
}
``` -->

##### `POST /user/{user_id}/withdraw`

Withdraw BNB to 'private' user wallet (out of game system)

`{user_id}` — users' id in *game* database (it will be the same).
Return user-wallet blockchain address.

Example query:

```js
{   
    amount: float,
    to: string // blockchain address
}
```

Example response:

```js
{   
    success: bool,
    balance: float // user-wallet balance after operation
}
```

### *userWalletRefillWebhook*

When user refills his user-wallet, wallets-manager sends webhook to game.

#### Webhook JSON

```js
{
    user: int, // user id in game db
    amount: float,
    balance: float 
}
```
