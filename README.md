
# wallets-manager

`v0.6b` currently. No NFTs for now. Super-exchange and q-manager being implemented.

Start the service:

**before doing steps listed below in production env:** you MUST run `/service/test/test.js`. Check it's output carefully, ask maintainer if you got non-obvious errors. But you should leave deployment to me or our future CI/CD pipeline!

1. Install Docker, enable it in systemctl,
2. `git pull` this repository,
3. do `cd service` and `npm install`,
4. create .env file peeping in example.env,
5. go back (`cd ..`) and start wallets-manager finally:

- startup with blockhain's `mainnet`: `docker-compose up -d`,
- with blockhain's `testnet`: `docker-compose -f docker-compose.testnet.yml up --build service`

if you got an error -- contact maintainer :)

## API

API methods documentation. Access at `127.0.0.1:2311/... ` without auth. Maintainer --  @RickCastle2018 (@nikonovcc in Telegram).

Built with REST in mind. So all query examples are JSON which you have to send in POST-data to service. And there's example for each API method: *Q --  Query struct. R -- Response struct*. If there's no *Responce*, service will return just 200 HTTP code or 500 error.

**Errors**: if there was an error while method execution, service will return 500 HTTP code, *and short error description*. For example: `Returned error: insufficient funds` or `Returned error: invalid sender` (if it was coder's error). But there was error after transaction check, service will return 200 OK, but then game will get webhook with `error` (see Webhooks section).

In examples you can find unusual type *Wei*. In blockchain all money amounts should be provided in Wei. Represented by `string` in JSON. Learn more: https://www.investopedia.com/terms/w/wei.asp

### transactions (!)

When game makes POST request, which supposed to move any funds (oglc/bnb/nft), transaction queue comes into play. 

For example, game does `POST /game-wallet/withdraw`: service will return *calculations* for transaction (fees, bnb-to-move, etc.) and if game provided `placeToQueue: true` in request, transaction will be prepared and waiting.

#### GET /transactions/{transaction_id}

After queuing game can access transaction by the `{transaction_id}`, which was provided by it in POST request to service earlier.

**Notice:** all transactions are stored in simple in-memory key-value storage, so if you got 404 error there's nothing special.


```js
R:

{
	type: string, // (see Webhooks section)
	currency: string, // oglc/bnb/nft
	from: string, // address
	to: string // address (!)
	amount/id: string // wei if amount / int if nft
}
```


#### DELETE /transactions/{transaction_id}

Delete (cancel) transaction without executing. *Not required, but expected:* otherwise transaction will be cancelled after 5 minutes from creation.

#### POST /transactions/{transaction_id}

Execute transaction. Game will get Webhook after it's confirmation.

*Planned to be implemented with global security patch:*

```js
Q:

{
   security_sign: ... // some kind of game sign
}
```

### gamewallet

game-wallet (`/game-wallet/{method}`) --  our 'bank'. *In future* there will be a few types (ex. `/game-wallets/oglc/ `, `/game-wallets/nft/`, ...).

#### GET /gamewallet

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

#### POST /gamewallet/withdraw

Withdraw money from game-wallet to user-wallet. There's no option to withdraw directly to an address for security.

```js
Q:

{   
    transaction_id: int,
    amount: wei,
    to: int, // idInGame
    currency: string // oglc or bnb
}
```

#### POST /gamewallet/buy

It's simple: send money from user-wallet to game-wallet.

```js
Q:

{   

    transaction_id: int,
    currency: string, // oglc or bnb
    amount: wei,
    from: int // idInGame

}
```

### userwallets

user-wallet (`/user-wallets/{user-id}/{method}`) -- a wallet which every user has, user's game account.

`{user_id}` -- should be the same as user's id in game's database.

#### GET /user-wallets/{user_id}

Get user data: balance and blockchain address.

```js
R:

{   
    balance: {
        bnb: wei,
        oglc: wei
    },
    address: string
}
```

#### PUT /userwallets/{user_id}

Create new user-wallet with the following `{user_id}`. Returns blockchain address.

```js
R:

{   
    address: string
}
```


#### POST /userwallets/{user_id}/withdraw

Withdraw OGLC/BNB out of game system. No fee for now (withdrawal fees will be implemented soon).

```js
Q:

{   
    transaction_id: int,
    amount: wei,
    to: string, // blockchain address
    currency: string // bnb or oglc
}
```


### exchange

Exchange OGLC for BNB or BNB for OGLC. *In future:*  Market NFT for Ogle NFT.

#### GET /exchange

Get exchange info.

```js
R:

{
    bnbPrice: int, // how much OGLC you can get for 1 BNB
    exchangeFee: float // ex. 0.25
}
```

#### POST /exchange/update

**Not implemented yet!** Change exchange fees or bnbPrice. You can provide only one value (bnbPrice of fee). Notice: if there's no exchange config in database, service will use params from `.env` file.

Mb, I'll implement wallets-manager's `/manager` to manage settings.

```js
Q:

{   
    bnbPrice: int,
    exchangeFee: float
}
```

#### POST /exchange

Exchange. Transaction will be placed into queue. Game will get 2 webhooks with the same `transaction_id`. In one of them will be `user` fied and user-wallet balances, in another -- won't and it will have balances of game-wallet.

```js
Q:

{   
    transaction_id: int,
    exchange: {
      from: string, // oglc/bnb
      bnb: wei,
      oglc: wei
    }
}
```

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

### Webhooks

wallets-manager sends webhook to game when requested transaction processed or user-wallet was refilled. So game should listen POST requests, URL of this listener should be passed in .env file.

**Notice:** it works only for game-requested transactions so webhook won't be sent when user refilled his wallet for ex. And this will be the case until we set up our blockchain nodes with websockets.

Webhook JSON:

```js
{   
    transaction_id: int,
    type: string, // see types list below
    successful: bool,
    error: string, // returned only if successful: false, none of objects below will be returned 
    gasPaid: string, // gas
    user: { // data about requested wallet after transaction (if requested /user-wallets/&  there will be data about the following user-wallet, if /game-wallet - data about game-wallet)
        id: int, // will be provided only with transactions with user-wallets
        balance: {
            bnb: wei,
            oglc: wei
        },
        address: string
    }
}
```

Types of Webhook events:

- 'refill' -- user-wallet has been refilled from 'outside' (no transaction_id will be sent)
- 'withdraw' -- transfer from user-wallet to the external address
- 'purchase' -- money from *user-wallet* to *game-wallet* transaction
- 'exit' -- money from *game-wallet* to *user-wallet* transaction. This type is almost similar to "refill", but it has transaction_id, but "refill" don't (because it can't be requested by the game)
<!-- - 'reclaim' -- user sent to user-wallet his NFT bought from market and service has exchanged it to Ogle -->

In future there will be also NFT-events here.

### Backups

You know, without backups you can loose everything. So, see `/db/backup.sh` and `/db/restore.sh`. `backup.sh` should be set in CRON.

### Logs

See `service/error.log` file and `server.js` for implementation. In future we'll have monitoring system (alarms, graphana, etc.).