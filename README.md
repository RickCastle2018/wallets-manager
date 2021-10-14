
# wallets-manager

`v0.5` currently. Everythig is module. Getting ready for OGLC-BNB exchange (v0.5.1), setting up NFT dev env.

Start the service:

1. Install Docker, enable it in systemctl,
2. `git pull` this repository,
3. do `cd service` and `npm install`,
4. create .env file peeping in example.env,
5. go back (`cd ..`) and start wallets-manager finally:

- startup with blockhain's `mainnet`: `docker-compose up -d`,
- with blockhain's `testnet`: `docker-compose -f docker-compose.testnet.yml up --build service`

if you got an error -- contact maintainer :)

## API

API methods documentation. Access at `127.0.0.1:2311/& ` without auth. Maintainer --  @RickCastle2018 (@nikonovcc in Telegram).

Built with REST in mind. So all query examples are JSON which you have to send in POST-data to service. And there's example for each API method: *Q --  Query struct. R -- Response struct*. If there's no *Responce*, service will return just 200 HTTP code.

**Errors**: if there was an error while method execution, service will return 500 HTTP code, *and short error description*. For example: `Returned error: insufficient` or `Returned error: invalid sender` (if it was coder's error). If there was error after transaction check, game will get webhook with `error` (see Webhooks section).

In examples you can find unusual type *Wei*. In blockchain all money amounts should be provided in Wei. Represented by `string` in JSON. Learn more: https://www.investopedia.com/terms/w/wei.asp

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
```

### user-wallets

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

#### PUT /user-wallets/{user_id}

Create new user-wallet with the following `{user_id}`. Returns blockchain address.

```js
R:

{   
    address: string
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
```

### exchange

Exchange OGLC for BNB or BNB for OGLC. Not that simple.

First, *game* should POST /exchange/calculate, and then POST /exchange with data received from first POST (`exchange` object).

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

```js
Q:

{   
    bnbPrice: int,
    exchangeFee: float
}
```

#### POST /exchange/calculate

Get calculations for the exchange.

```js
Q:

{   
    currency: string, // from
    amount: wei
}

R:

{   
    possible: bool,
    error: string, // returned only if possible: false
    feePaid: wei, // fee is always paid in BNB
    exchange: {
      from: string, // oglc/bnb
      bnb: wei,
      oglc: wei
    }
}
```

#### POST /exchange

Exchange. In query you should send `exchange` object from `/exchnage/calculate` responce. Game will get 2 webhooks with the same `transaction_id`. In one of them will be `user` fied and user-wallet balances, in another -- won't and it will have balances of game-wallet.

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

**Not implemented yet!** This is a draft, and none of the methods listed below works.

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

It's simple: send money from user-wallet to game-wallet.

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
