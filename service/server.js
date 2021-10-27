import winston from 'winston'
import mongoose from 'mongoose'
import express from 'express'

import { listenRefills } from './wallets/refills.js'

import * as gw from './api/gamewallet.js'
import * as uw from './api/userwallets.js'
import * as tx from './api/transactions.js'

const { createLogger, transports } = winston
const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'service.log' })
  ]
  // TODO: v0.6.1
  // format: format.combine(
  //   format.label({
  //     label: 'v0.6'
  //   }),
  //   format.timestamp({
  //     format: 'MMM-DD-YYYY HH:mm:ss'
  //   }),
  //   format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`)
  // )
})
logger.exceptions.handle(new transports.Console(),
  new transports.File({ filename: 'exceptions.log' }))

// Start mongoose connection
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// If connected successfully, run API
const conn = mongoose.connection
conn.on('error', console.error.bind(console, 'connection error:'))
conn.once('open', () => {
  // Start Refills Listening
  listenRefills()

  // Define express.js app
  const app = express()

  // Auto JSON responces parsing&marshalling
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(express.json())

  // trasactions
  app.use('/transactions*', tx.middleware)
  app.get('/trasactions/:txId', tx.get)
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
  app.get('/user-wallets/:idInGame', uw.get)
  app.post('/user-wallets/:idInGame/withdraw', uw.withdraw)
  // exchange
  app.get('/user-wallets/:idInGame/exchange', uw.getExchange)
  app.post('/user-wallets/:idInGame/exchange', uw.exchange)
  // testnet
  // if (process.env.NODE_ENV === 'development') {
  //   app.post('/user-wallets/:idInGame/getTestCoin', uw.getTestCoin)
  // }

  // TODO: nfts
  // app.get('/nfts/:id', nft.get)

  app.listen(2311, () => {
    console.log('wallets-manager running at http://127.0.0.1:2311')
  })
})
