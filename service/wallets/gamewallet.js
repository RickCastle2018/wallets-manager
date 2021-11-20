import mongoose from 'mongoose'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import coin, { transfer as transferCoin } from '../coin/coin.js'
import { load as loadUserWallet } from './userwallet.js'
import comissionExchange from './comissionexchange.js'
import logger from '../utils/logger.js'

const gameWalletSchema = new mongoose.Schema({
  address: String,
  privateKey: String
})
gameWalletSchema.methods.getBalance = function (callback) {
  coin.methods.balanceOf(this.address).call().then((coins) => {
    web3.eth.getBalance(this.address).then((bnb) => {
      callback(null, {
        oglc: coins,
        bnb: bnb
      })
    })
  })
}
gameWalletSchema.methods.withdraw = function (txId, currency, amount, recipientGameId, callback) {
  loadUserWallet(recipientGameId, (err, uW) => {
    if (err) return callback(err)
    if (uW) {
      switch (currency) {
        case 'bnb':
          transferBNB(txId, this, uW.address, amount,
            (err, tx) => {
              if (err) return callback(err)
              callback(null, tx.data)
            })
          break
        case 'oglc':
          transferCoin(txId, this, uW.address, amount,
            (err, tx) => {
              if (err) return callback(err)
              callback(null, tx.data)
            })
      }
    } else {
      callback(new Error('recipient not provided'))
    }
  })
}
gameWalletSchema.methods.buy = function (txId, currency, amount, depositorGameId, callback) {
  loadUserWallet(depositorGameId, (err, uW) => {
    if (err) return callback(err)
    if (uW) {
      uW.activate((err) => {
        if (err) return callback(err)

        let transfer = transferCoin
        if (currency === 'bnb') transfer = transferBNB

        transfer(txId, uW, this.address, amount,
          (err, tx) => {
            if (err) return callback(err)

            comissionExchange(tx, uW, (err) => {
              if (err) return callback(err)
              return callback(null, tx.data)
            })
          })
      })
    } else {
      callback(new Error('user (from) not provided'))
    }
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
      privateKey: account.privateKey
    })
    gW.save((err) => {
      if (err) return logger.error(err)
    })
    gameWallet = gW
  } else {
    const gW = gameWallets[0]
    gameWallet = gW
  }
}
export function load (callback) {
  callback(gameWallet)
}
