# wallets-manager

`v0.1.0` — beta (in development, wait for release)

1. Install Docker, enable it in systemctl
2. Clone repo
3. Run `docker-compose up -d`

## API

API methods documentation.

All questions: @nikonovcc in Telegram

### Access API

At `127.0.0.1:2311/…` without auth.

### API Methods

There are two kinds of managed wallets in system:

* round-wallets — `/round-wallet/{method}` — type of wallets which used for *deposits* in games. Game has only one round wallet.
* user-wallets — `/user-wallets/{user-id}/{method}` — type of wallets which every user has, this wallet is users' game account

*Notice*: all query examples are JSON which you have to send in POST-data to service.

*Q — Query example. R — Response example.*

#### round-wallet methods

Interact with round wallets

##### GET /round-wallet/

Return games' round-wallet blockchain address and balance.

R:

```js
{
    blockchain_address: string,
    balance: float
}
```

##### POST /round-wallet/withdraw

Withdraw money from round-wallet to user-wallet

Q:

```js
{
    amount: float,
    to: int // user id in game database
}
```

R:

```js
{
    successful: bool,
    error: string // returned if there was an error
}
```

##### POST /round-wallet/deposit

Send (enter deposit) money from user-wallet to round-wallet

Q:

```js
{
    amount: float,
    from: int // user id in game database
}
```

R:

```js
{
    successful: bool,
    error: string // returned if there was an error
}
```

#### user-wallets methods

API methods to interact with user-wallets

`{user_id}` — users' id in *game* database (it will be the same). Create user-wallet linkedto his id in game database.

##### POST /user-wallets/{user_id}

Create user-wallet

R:

```js
{   
    success: bool,
    blockchain_address: string,
}
```

##### GET /user-wallets/{user_id}

Get user data (balance & blockchain address)

R:

```js
{   
    balance: float
    blockchain_address: string,
}
```

##### POST /user-wallets/{user_id}/buy

Will be implemented if needed.

<!-- 
 -->

##### GET /user-wallets/{user_id}/transactions

Will be implemented after beta

<!--
R:

```js
{   
    transactions: [
        {
            TRANSACTION JSON
        },
        …
    ]
}
```  -->

##### POST /user-wallets/{user_id}/withdraw

Withdraw BNB to 'private' user wallet (out of game system)

Q:

```js
{   
    amount: float,
    to: string // blockchain address
}
```

R:

```js
{   
    success: bool,
}
```

### userWalletsRefills Webhook

When user refills his user-wallet, wallets-manager sends webhook to game. Webhook listener url (destination) should be passed in docker-compose service environment.

#### Webhook JSON

```js
{
    user: int, // user id in game db
    amount: float,
    balance: float 
}
```
