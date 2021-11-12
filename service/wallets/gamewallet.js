import mongoose from 'mongoose'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import coin, { transfer as transferCoin } from '../coin/coin.js'
import { load as loadUserWallet } from './userwallet.js'
import exchange from '../coin/exchange.js' // used for OGLC commisions
import initialRefill from './initialrefill.js'

const gameWalletSchema = new mongoose.Schema({
  address: String,
  privateKey: String // TODO: encrypt DB
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
  initialRefill(depositorGameId, (err) => {
    if (err) return callback(err)

    loadUserWallet(depositorGameId, (err, uW) => {
      if (err) return callback(err)
      if (uW) {
        // TODO: no code repeating
        switch (currency) {
          case 'bnb':
            transferBNB(txId, uW, this.address, amount,
              (err, tx) => {
                if (err) return callback(err)

                exchange([txId + 'c', txId + 'b'], uW, Math.round(web3.utils.toWei((tx.data.fee * 5).toString(), 'gwei') * 2 * process.env.BNB_PRICE * 1.1).toFixed().toString(), 'oglc', (err) => {
                  if (err) return callback(err)
                  return callback(null, tx.data)
                })
              })
            break
          case 'oglc':
            transferCoin(txId, uW, this.address, amount,
              (err, tx) => {
                if (err) return callback(err)

                exchange([txId + 'c', txId + 'b'], uW, Math.round(web3.utils.toWei((tx.data.fee * 5).toString(), 'gwei') * 2 * process.env.BNB_PRICE * 1.1).toFixed().toString(), 'oglc', (err) => {
                  if (err) return callback(err)
                  return callback(null, tx.data)
                })
              })
        }
      } else {
        callback(new Error('user (from) not provided'))
      }
    })
  })
}
const GameWallet = mongoose.model('GameWallet', gameWalletSchema)
export default GameWallet

// TODO: cache! do not load from db everytime!
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
