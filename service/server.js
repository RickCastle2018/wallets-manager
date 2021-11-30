import mongoose from 'mongoose'
import express from 'express'

import logger from './utils/logger.js'

import { listenRefills } from './wallets/refills.js'
import { init as initGameWallet } from './wallets/gamewallet.js'

import * as gw from './api/gamewallets.js'
import * as uw from './api/userwallets.js'
import * as tx from './api/transactions.js'

mongoose.connect(`mongodb://ogle:nikita@127.0.0.1:27017/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const conn = mongoose.connection
conn.on('error', err => {
  logger.error(err)
})
conn.once('open', async () => {
  // initializing...
  initGameWallet()
  listenRefills()

  const app = express()
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(express.json())

  // trasactions
  app.use('/transactions/:txId*', tx.middleware)
  app.get('/transactions/:txId', tx.get)
  app.delete('/transactions/:txId', tx.cancel)
  app.post('/transactions/:txId', tx.proceed)

  // game-wallet
  app.use('/game-wallet*', gw.middleware)
  app.get('/game-wallet', gw.get)
  app.post('/game-wallet/withdraw', gw.withdraw)
  app.post('/game-wallet/buy', gw.buy)

  // user-wallets
  app.put('/user-wallets/:idInGame', uw.create)
  app.use('/user-wallets/:idInGame*', uw.middleware)
  // TODO: app.post('/user-wallets/:idInGame/import', uw.import)
  // app.get(/user-wallets/:idInGame/export)
  app.get('/user-wallets/:idInGame', uw.get)
  app.post('/user-wallets/:idInGame/withdraw', uw.withdraw)
  // exchange
  app.get('/user-wallets/:idInGame/exchange', uw.getExchange)
  app.post('/user-wallets/:idInGame/exchange', uw.exchange)

  // TODO: nfts
  // app.get('/nfts/:id', nft.get)

  app.listen(2311, () => {
    logger.info('wallets-manager running at http://127.0.0.1:2311')
  })
})
