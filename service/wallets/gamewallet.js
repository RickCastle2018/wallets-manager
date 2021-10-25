import mongoose from 'mongoose'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import coin, { transfer as transferCoin } from '../coin/coin.js'
import { load as loadUserWallet } from './userwallet.js'

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
  loadUserWallet(recipientGameId, (uW) => {
    if (uW) {
      switch (currency) {
        case 'bnb':
          transferBNB(txId, this, uW.address, amount,
            (err) => {
              callback(err)
            })
          break
        case 'oglc':
          transferCoin(txId, this, uW.address, amount,
            (err) => {
              callback(err)
            })
      }
    } else {
      callback(new Error('recipient not provided'))
    }
  })
}
gameWalletSchema.methods.buy = function (txId, currency, amount, depositorGameId, callback) {
  loadUserWallet(depositorGameId, (uW) => {
    if (uW) {
      switch (currency) {
        case 'bnb':
          transferBNB(txId, uW, this.address, amount,
            (err) => {
              callback(err)
            })
          break
        case 'oglc':
          transferCoin(txId, uW, this.address, amount,
            (err) => {
              callback(err)
            })
      }
    } else {
      callback(new Error('no recipient provided'))
    }
  })
}
const GameWallet = mongoose.model('GameWallet', gameWalletSchema)
export default GameWallet

export function load (callback) {
  GameWallet.find({}, (err, gameWallets) => {
    if (err) return console.error(err)

    if (gameWallets.length < 1) {
      const account = web3.eth.accounts.create()
      const gW = new GameWallet({
        address: account.address,
        privateKey: account.privateKey
      })
      gW.save((err) => {
        if (err) return console.error(err)
      })
      callback(gW)
    } else {
      const gW = gameWallets[0]
      callback(gW)
    }
  })
}
