# wallets-manager

`v0.1.0` — beta (in development, wait for release)

1. Install Docker
2. Clone repo
3. Run `docker-compose up`

## API

API methods documentation.

All questions: @nikonovcc in Telegram

### Access API

At `localhost:2311/…`

### API Methods

There are two kinds of managed wallets in system:

* deposit-wallets — `/deposit/{method}` — type of wallets which used for *deposits* in games
* user-wallets — `/user/{user-id}/{method}` — type of wallets which every user has, this wallet is users' game account

*Notice*: all query examples are JSON which you have to send in POST-data to service

#### /deposit

API methods to interact with deposit-wallets

##### `GET /deposit`

Return games' deposit-wallet blockchain address and balance.

Example response:

```js
{
    blockchain_address: string,
    balance: float
}
```

##### `POST /deposit/withdraw`

Withdraw money from deposit-wallet to user-wallet

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

##### `POST /deposit/enter`

Send (enter deposit) money from user-wallet to deposit-wallet

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

#### /user

API methods to interact with user-wallets

##### `POST /user/{user_id}`

Create user (when he registers in game)

`{user_id}` — users' id in *game* database (it will be the same). Create user-wallet linked to game codename.

Example response:

```js
{   
    success: bool,
    blockchain_address: string,
}
```

##### `GET /user/{user_id}`

Get user data

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
    to: string 
}
```

Example response:

```js
{   
    success: bool,
    balance: float // user-wallet balance after operation
}
```

### About *userWalletRefillWebhook*

How to do game account/balance — user-wallet refill:

1. Game shows to user his user-wallet address
2. User from his own 'private' wallet sends money to this address
3. *wallets-manager* service sends webhook to game: account refilled

Then we have that game have to handle this webhook on address, specified when deposit-wallet was created (userWalletRefillWebhook: string…).

#### Webhook JSON

```js
{
    user: int/string, // user id in game db
    amount: float,
    balance: float
}
```
