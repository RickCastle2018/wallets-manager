import mongoose from 'mongoose'
import axios from 'axios'
import BigNumber from '../utils/calculations.js'

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
userWalletSchema.methods.getBalance = function (cb) {
  coin.methods.balanceOf(this.address).call().then((coins) => {
    web3.eth.getBalance(this.address).then((bnb) => {
      cb(null, {
        oglc: coins,
        bnb: bnb
      })
    }).catch(e => cb)
  }).catch(e => cb)
}
userWalletSchema.methods.withdraw = function (txId, currency, amount, recipientAddress, cb) {
  this.activate(err => {
    if (err) return cb(err)

    let transfer = transferCoin
    if (currency === 'bnb') transfer = transferBNB

    transfer(txId, this, recipientAddress, amount,
      (err, tx) => {
        if (err) return cb(err)

        if (transfer === transferBNB) return cb(null, tx.data)

        commissionExchange(tx, this, (err) => {
          if (err) return cb(err)
          cb(null, tx.data)
        })
      })
  })
}
userWalletSchema.methods.exchange = function (txIds, currencyFrom, amount, cb) {
  exchange(txIds, this, amount, currencyFrom,
    (err) => {
      cb(err)
    })
}
userWalletSchema.methods.import = function (privateKey, cb) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  this.privateKey = privateKey
  this.address = account.address
  this.save()
    .then(s => { cb() })
    .catch(e => cb)
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
userWalletSchema.methods.activate = function (cb) {
  loadGameWallet((gW) => {
    this.getBalance((err, balance) => {
      if (err) return cb(err)

      if (web3.utils.fromWei(balance.bnb) < 0.001) {
        const bnbBalance = new BigNumber(web3.utils.fromWei(balance.bnb))

        let sendAmount = bnbBalance.minus(0.001)
        if (sendAmount.isNegative) {
          sendAmount = web3.utils.toWei(sendAmount.multipliedBy(-1).toString())

          transferBNB('initialRefill' + this.idInGame, gW, this.address, sendAmount,
            async (err, tx) => {
              if (err) return cb(err)

              const bnbFee = tx.data.fee.bnb
              if (web3.utils.toWei(bnbFee.toString(), 'gwei') <= sendAmount) {
                tx.execute((err) => {
                  if (err) return cb(err)
                  return cb()
                })
              } else {
                tx.cancel()
                return cb()
              }
            })
        } else {
          return cb()
        }
      } else {
        return cb()
      }
    })
  })
}
const UserWallet = mongoose.model('UserWallet', userWalletSchema)
export default UserWallet

export function create (userIdInGame, cb) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err, uW) => {
    if (err) cb(err)

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
          cb(null, uW)
        }
      )
    } else {
      cb(new Error('already exists'))
    }
  })
}

// TODO: promises + master func instead of zoo
export function load (userIdInGame, cb) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err, uW) => {
    cb(err, uW)
  })
}

export function loadByAddr (addr, cb) {
  UserWallet.findOne({
    address: addr
  }, (err, uW) => {
    cb(err, uW)
  })
}

export function loadByPK (pK, cb) {
  UserWallet.findOne({
    privateKey: pK
  }, (err, uW) => {
    cb(err, uW)
  })
}
