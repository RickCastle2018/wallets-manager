import mongoose from 'mongoose'
import axios from 'axios'
import BigNumber from 'bignumber.js'

import logger from '../utils/logger.js'
import web3 from '../blockchain/web3.js'
import commissionExchange from './commissionexchange.js'

import coin, { transfer as transferCoin } from '../coin/coin.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import exchange from '../coin/exchange.js'
import { load as loadGameWallet } from './gamewallet.js'
import { usersAddrs } from './refills.js'

const userWalletSchema = new mongoose.Schema({
  createdDate: Date,
  idInGame: Number,
  address: String,
  privateKey: String
})
userWalletSchema.methods.getBalance = function (callback) {
  coin.methods.balanceOf(this.address).call().then((coins) => {
    web3.eth.getBalance(this.address).then((bnb) => {
      callback(null, {
        oglc: coins,
        bnb: bnb
      })
    })
  })
}
userWalletSchema.methods.withdraw = function (txId, currency, amount, recipientAddress, callback) {
  this.activate(err => {
    if (err) return callback(err)

    let transfer = transferCoin
    if (currency === 'bnb') transfer = transferBNB

    transfer(txId, this, recipientAddress, amount,
      (err, tx) => {
        if (err) return callback(err)

        if (transfer === transferBNB) return callback(null, tx.data)

        commissionExchange(tx, this, (err) => {
          if (err) return callback(err)
          callback(null, tx.data)
        })
      })
  })
}
userWalletSchema.methods.exchange = function (txIds, currencyFrom, amount, callback) {
  exchange(txIds, this, amount, currencyFrom,
    (err) => {
      callback(err)
    })
}
userWalletSchema.methods.import = function (privateKey, callback) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  this.privateKey = privateKey
  this.address = account.address
  this.save()
    .then(s => { callback() })
    .catch(e => callback)
}
userWalletSchema.methods.export = function (txId) {
  axios({
    method: 'post',
    url: process.env.WEBHOOKS_LISTENER,
    data: {
      transaction_id: txId,
      type: 'export',
      privateKey: this.privateKey
    }
  }).catch(err => {
    logger.error(err)
  })
}
userWalletSchema.methods.activate = function (callback) {
  loadGameWallet((gW) => {
    this.getBalance((err, balance) => {
      if (err) return callback(err)

      if (web3.utils.fromWei(balance.bnb) < 0.001) {
        const bnbBalance = new BigNumber(web3.utils.fromWei(balance.bnb))

        let sendAmount = bnbBalance.minus(0.001)
        if (sendAmount.isNegative) {
          sendAmount = web3.utils.toWei(sendAmount.multipliedBy(-1).toString())

          transferBNB('initialRefill' + this.idInGame, gW, this.address, sendAmount,
            async (err, tx) => {
              if (err) return callback(err)

              const gasPrice = await web3.eth.getGasPrice()
              const bnbFee = tx.data.fee * web3.utils.fromWei(gasPrice, 'gwei') * 1.01

              if (web3.utils.toWei(bnbFee.toString(), 'gwei') <= sendAmount) {
                tx.execute((err) => {
                  if (err) return callback(err)
                  return callback()
                })
              } else {
                tx.cancel()
                return callback()
              }
            })
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    })
  })
}
const UserWallet = mongoose.model('UserWallet', userWalletSchema)
export default UserWallet

export function create (userIdInGame, callback) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err, uW) => {
    if (err) callback(err)

    if (!uW) {
      const account = web3.eth.accounts.create()
      const userWallet = new UserWallet({
        createdDate: new Date(),
        idInGame: userIdInGame,
        address: account.address,
        privateKey: account.privateKey
      })
      userWallet.save().then(
        (uW) => {
          usersAddrs.push(uW.address)
          callback(null, uW)
        }
      )
    } else {
      callback(new Error('already exists'))
    }
  })
}

export function load (userIdInGame, callback) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err, uW) => {
    callback(err, uW)
  })
}

export function loadByAddr (addr, callback) {
  UserWallet.findOne({
    address: addr
  }, (err, uW) => {
    callback(err, uW)
  })
}

export function loadByPK (pK, callback) {
  UserWallet.findOne({
    privateKey: pK
  }, (err, uW) => {
    callback(err, uW)
  })
}
