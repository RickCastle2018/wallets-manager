import mongoose from 'mongoose'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import coin, { transfer as transferCoin } from '../coin/coin.js'
import { load as loadUserWallet } from './userwallet.js'
import commissionExchange from './commissionexchange.js'
import logger from '../utils/logger.js'

const gameWalletSchema = new mongoose.Schema({
  address: String,
  privateKey: String,
  bnbExchangePool: String
})
// TODO: promises
gameWalletSchema.methods.getBalance = function (cb) {
  coin.methods.balanceOf(this.address).call().then((coins) => {
    web3.eth.getBalance(this.address).then((bnb) => {
      cb(null, {
        oglc: coins,
        bnb: bnb
      })
    }).catch(e => cb)
  }).catch(e => cb)
}
gameWalletSchema.methods.withdraw = function (txId, currency, amount, recipientGameId, cb) {
  loadUserWallet(recipientGameId, (err, uW) => {
    if (err) return cb(err)
    if (uW) {
      switch (currency) {
        case 'bnb':
          transferBNB(txId, this, uW.address, amount,
            (err, tx) => {
              if (err) return cb(err)
              cb(null, tx.data)
            })
          break
        case 'oglc':
          transferCoin(txId, this, uW.address, amount,
            (err, tx) => {
              if (err) return cb(err)
              cb(null, tx.data)
            })
      }
    } else {
      cb(new Error('recipient not provided'))
    }
  })
}
gameWalletSchema.methods.buy = function (txId, currency, amount, depositorGameId, cb) {
  loadUserWallet(depositorGameId, (err, uW) => {
    if (err) return cb(err)
    if (uW) {
      uW.activate((err) => {
        if (err) return cb(err)

        let transfer = transferCoin
        if (currency === 'bnb') transfer = transferBNB

        transfer(txId, uW, this.address, amount,
          (err, tx) => {
            if (err) return cb(err)

            // TODO: accurate calculations
            this.poolIncrease(amount * parseFloat(process.env.COIN_EXCHANGE_LIMIT))

            commissionExchange(tx, uW, (err) => {
              if (err) return cb(err)
              return cb(null, tx.data)
            })
          })
      })
    } else {
      cb(new Error('user (from) not provided'))
    }
  })
}
gameWalletSchema.methods.withdrawProfit = function () {
  // TODO: GET PROFIT

}
gameWalletSchema.methods.poolIncrease = function (wei) {
  this.bnbExchangePool = web3.utils.fromWei(wei.toString()) + this.bnbExchangePool
  this.save((err) => {
    if (err) return logger.error(err)
  })
}
gameWalletSchema.methods.poolDecrease = function (wei) {
  this.bnbExchangePool = this.bnbExchangePool - web3.utils.fromWei(wei.toString())
  this.save((err) => {
    if (err) return logger.error(err)
  })
}
const GameWallet = mongoose.model('GameWallet', gameWalletSchema)
export default GameWallet

// game-wallet init
export let gameWallet
export async function init () {
  const gameWallets = await GameWallet.find({})
  if (gameWallets.length < 1) {
    const account = web3.eth.accounts.create()
    const gW = new GameWallet({
      address: account.address,
      privateKey: account.privateKey,
      exchangePool: '0'
    })
    gW.save((err) => {
      if (err) return logger.error(err)
    })
    gameWallet = gW
  } else {
    const gW = gameWallets[0]
    gameWallet = gW
  }
  gameWallet.getBalance(b => {
    gameWallet.poolIncrease(b.bnb * process.env.COIN_EXCHANGE_LIMIT)
  })
}

// Cached loading
// export function load (cb) {
//   cb(gameWallet)
// }

// TODO: promises
export function load (callback) {
  GameWallet.find({}, (err, gameWallets) => {
    if (err) return console.error(err)
    callback(gameWallets[0])
  })
}
