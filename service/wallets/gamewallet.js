import mongoose from 'mongoose'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import coin, { transfer as transferCoin } from '../coin/coin.js'
import { load as loadUserWallet } from './userwallet.js'
import commissionExchange from './commissionexchange.js'
import logger from '../utils/logger.js'
import { xPercentsOfNumber } from '../utils/calculations.js'

const gameWalletSchema = new mongoose.Schema({
  address: String,
  privateKey: String,
  exchangePool: String
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

            if (transfer === transferBNB) {
              this.poolIncrease(amount * parseFloat(process.env.COIN_EXCHANGE_LIMIT))
              return cb(null, tx.data)
            }

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
// TODO: not percent, but autocalculation!
gameWalletSchema.methods.withdrawProfit = function (txId, currency, percent, cb) {
  gameWallet.getBalance((err, b) => {
    if (err) return cb(err)
    const balance = web3.utils.fromWei(b)
    const bnAmount = xPercentsOfNumber(percent, balance)
    const amountWei = web3.utils.toWei(bnAmount.toString())

    let transfer = transferBNB
    if (currency === 'oglc') transfer = transferCoin

    transfer(txId, this, process.env.CORP_WALLET, amountWei,
      (err, tx) => {
        if (err) return cb(err)
        tx.execute()
        cb()
      }
    )
  })
}
gameWalletSchema.methods.poolIncrease = function (wei) {
  this.exchangePool = parseFloat(this.exchangePool) + parseFloat(web3.utils.fromWei(wei.toString()))
  this.exchangePool = this.exchangePool.toString()
  this.save((err) => {
    if (err) return logger.error(err)
  })
}
gameWalletSchema.methods.poolDecrease = function (wei) {
  this.exchangePool = parseFloat(this.exchangePool) - parseFloat(web3.utils.fromWei(wei.toString()))
  this.exchangePool = this.exchangePool.toString()
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
  gameWallet.getBalance((err, b) => {
    if (err) return logger.error(err)
    gameWallet.exchangePool = (parseFloat(web3.utils.fromWei(b.bnb.toString())) * parseFloat(process.env.COIN_EXCHANGE_LIMIT)).toString()
    gameWallet.save((err) => {
      if (err) return logger.error(err)
    })
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
