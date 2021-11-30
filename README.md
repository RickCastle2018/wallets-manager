
# wallets-manager

**Status:** Everything with our coin and it's exchange (commision system) is ready.

Start the service:

*Before doing steps listed below you must run `api/test.js`, but leave deployment to me or our future CI/CD pipeline if it's possible, please.*

1. Install Docker, enable it in systemctl,
2. `git pull` this repository,
3. do `cd service` and `npm install`,
4. create .env file (see example.env),
5. go back (`cd ..`) and start:

- `mainnet`: `docker-compose up -d`,
- `testnet`: `docker-compose -f docker-compose.testnet.yml up --build service`

If you got an error -- contact maintainer.

## API

API methods documentation. Access at `127.0.0.1:2311/...` without auth. Maintainer --  @RickCastle2018 (@nikonovcc in Telegram).

Built with REST in mind. So all query examples are JSON which you have to send in POST-data to service. And there's example for each API method: *Q --  Query struct. R -- Response struct*. If there's no *Responce* in example, service will return just 200 HTTP code or 500 error.

**Errors**: if there was an error while method execution, service will return 500 HTTP code, *and short error description*. For example: `Returned error: insufficient funds` or `Returned error: invalid sender` (if it was coder's error). But if there was error after transaction pre-check, service will return 200 OK, but then game will get webhook with `error` (see Webhooks section).

In examples you can find unusual type *Wei*. In blockchain all money amounts should be provided in Wei. Represented by `string` in JSON. Learn more: https://www.investopedia.com/terms/w/wei.asp

### transactions (!)

When game makes POST request, which supposed to move any funds (oglc/bnb/nft), transaction queue comes into play.

For example, game does `POST /game-wallet/withdraw`: service will return *calculations* for transaction (fees, bnb-to-move, etc.) and transaction will be prepared and waiting for execution (POST /transactions).

#### GET /transactions/{transaction_id}

After queuing game can access transaction by the `{transaction_id}`, which was provided by it in POST request to service earlier.

**Notice:** all transactions are stored in simple in-memory key-value storage, so if you got 404 error there's nothing special.


```js
R:

{
	from: string, // address
	to: string, // address
	currency: string, // oglc/bnb/nft
	amount: string, // wei if amount / int if nft
	fee: string // gas
}
```


#### DELETE /transactions/{transaction_id}

Delete (cancel) transaction without executing. It's *not required, but expected:* otherwise transaction will be cancelled after 5 minutes from creation.

#### POST /transactions/{transaction_id}

Execute transaction. Game will get Webhook after it's confirmation.

### game-wallet

game-wallet (`/game-wallet/{method}`) --  our 'bank'. *In future* there will be a few types (ex. `/game-wallets/oglc/ `, `/game-wallets/nft/`, ...).

#### GET /game-wallet

Return game's game-wallet data: blockchain address and balance.

```js
R:

{
    address: string,
    balance: {
        bnb: wei,
        oglc: wei
    }
}
```

#### POST /game-wallet/withdraw

Withdraw money from game-wallet to user-wallet. There's no option to withdraw directly to an address for security.

```js
Q:

{   
    transaction_id: int,
    amount: wei,
    to: int, // idInGame
    currency: string // oglc or bnb
}

R:

{
	transaction
}
```

#### POST /game-wallet/buy

It's simple: send money from user-wallet to game-wallet.

```js
Q:

{   

    transaction_id: int,
    currency: string, // oglc or bnb
    amount: wei,
    from: int // idInGame
}

R:

{
	transaction
}
```

### user-wallets

user-wallet (`/user-wallets/{user-id}/{method}`) -- a wallet which every user has, user's game account.

`{user_id}` -- should be the same as user's id in game's database.

**Notice:** `address` can be used intead of `user_id` in any /user-wallets method!

#### GET /userwallets/{user_id OR address OR privateKey}

Get user data: balance and blockchain address.

```js
R:

{   
	id: int,
    balance: {
        bnb: wei,
        oglc: wei
    },
    address: string
}
```

#### PUT /user-wallets/{user_id}

Create new user-wallet with the following `{user_id}`. Returns blockchain address.

```js
R:

{   
    address: string,
    privateKey: string
}
```

#### POST /user-wallets/{user_id}/

Create new user-wallet with the following `{user_id}`. Returns blockchain address.

```js
R:

{   
    address: string,
    privateKey: string
}
```

#### POST /user-wallets/{user_id}/withdraw

Withdraw OGLC/BNB out of game system. No fee for now (withdrawal fees will be implemented soon).

```js
Q:

{   
    transaction_id: int,
    amount: wei,
    to: string, // blockchain address
    currency: string // bnb or oglc
}

R:

{
	transaction // as GET /transactions
}
```

#### GET /user-wallets/{user_id}/exchange

Get exchange info.

```js
R:

{
    bnbPrice: int, // how much OGLC you can get for 1 BNB
    exchangeFee: float // ex. 0.25
}
```

#### POST /user-wallets/{user_id}/exchange

Exchange. Transactions will be executed right away. Game will get 2 webhooks.

```js
Q:

{   
    transaction_id: [int, int],
    currency: string, // from
    amount: wei
}
```

<!--

 ### nfts

**Nothing implemented yet!** This is a draft, and none of the methods listed below works.

#### GET /nfts

Get all minted Ogles.

```js
R:

{
  [...] // array of int (nft ids)
}
```

#### GET /nfts/{nft_id}

Get token's JSON.

```js
{  // see https://nftschool.dev/reference/metadata-schemas/#ethereum-and-evm-compatible-chains
  name: string,
  description: string,
  image: string, // url (ex. ogle.money/nft/123.jpg),
  properties: {
  	owner: int, // idInGame
    type: string, // ogle/clanowner/hogle
    collection: string,
    rarity: string,
    value: string, // wei, bnb
    posessions: [] of int, // nft ids
    // and more, we haven't standartized it yet
  }
}
```


#### POST /nfts/buy

Mint new NFT and send to user.

```js
Q:

{   

    type: string, // ogle/clanowner/hogle
    from: int, // idInGame
}
```

 -->

### Webhooks

wallets-manager sends webhook to game when requested transaction processed or user-wallet was refilled. So game should listen POST requests, URL of this listener should be passed in .env file.

Internal webhook JSON (transactions, requested by game):

```js
{   
    transaction_id: int,
    type: 'internal',
    successful: bool,
    error: string, // returned only when unsuccessful
    gasPaid: string, // gas
    from: string, // address
    to: string // address
}
```

External webhooks JSON (**only COIN refills from outside**)

```js
{   
    transaction_id: 0,
    type: 'external',
    from: string, // address
    to: object, // see GET /user-wallets/{id}
    amount: string
}
```

### Backups

You know, without backups you can loose everything. So, see `/db/backup.sh` and `/db/restore.sh`. `backup.sh` should be set in CRON. Setup instructions are provided right in sh code.

### Logs

Are written to `service/exceptions.log` and `service/service.log` files. Implemented in `service/utils/logger.js`. In future we'll have monitoring system (alarms, graphana, etc.).
