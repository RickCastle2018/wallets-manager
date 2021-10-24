// import {createLogger, transports} from 'winston';
import mongoose from 'mongoose'
import express from 'express'

import * as gw from './api/gamewallet.js'
import * as uw from './api/userwallets.js'
import * as exchange from './api/exchange.js'
import * as tx from './api/transactions.js'

// const logger = createLogger({
//  transports: [
//  new transports.File({ filename: 'combined.log' })
//  ]
// });
//
// // Call exceptions.handle with a transport to handle exceptions
// logger.exceptions.handle(new transports.File({
//  filename: 'error.log'
// }));

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
  // listenRefills();

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
  app.get('/exchange', exchange.get)
  app.post('/exchange/calculate', exchange.calculate)
  app.post('/user-wallets/:idInGame/exchange', exchange.make)

  // nfts
  // app.get('/nfts/:id', nft.get)

  app.listen(2311, () => {
    console.log('wallets-manager running at http://127.0.0.1:2311')
  })
})
