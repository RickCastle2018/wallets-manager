import mongoose from 'mongoose'
import coin, { transfer as transferCoin } from '../coin/coin.js'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import exchange from '../coin/exchange.js' // also, used for OGLC commisions
import comissionExchange from './comissionexchange.js'
import BigNumber from 'bignumber.js'
import { load as loadGameWallet } from './gamewallet.js'

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

        comissionExchange(tx, this, (err) => {
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
userWalletSchema.methods.activate = function (callback) {
  loadGameWallet((gW) => {
    this.getBalance((err, balance) => {
      if (err) return callback(err)

      if (web3.utils.fromWei(balance.bnb) < 0.001) {
        const bnbBalance = new BigNumber(web3.utils.fromWei(balance.bnb))
        let sendAmount = bnbBalance.minus(0.001)

        if (sendAmount.isNegative || sendAmount.toString === 0) {
          sendAmount = 0.001
        }

        // НЕ ОТСЫЛАТЬ, ЕСЛИ МЕНЬШЕ, ЧЕМ КОМИССИЯ!

        transferBNB('initialRefill' + this.idInGame, gW, this.address, web3.utils.toWei(sendAmount.toString()),
          (err, tx) => {
            if (err) return callback(err)

            tx.execute((err) => {
              if (err) return callback(err)
              return callback()
            })
          })
      } else {
        return callback()
      }
    })
  })
}
userWalletSchema.methods.buy = function (txId, currency, amount, callback) {
  // TODO: reserved for NFTs
  // ДОКИ
  // loadGameWallet((gW) => {
  //   this.activate((err) => {
  //     if (err) return callback(err)
  //
  //     let transfer = transferCoin
  //     if (currency === 'bnb') transfer = transferBNB
  //
  //     transfer(txId, this, gW.address, amount,
  //       (err, tx) => {
  //         if (err) return callback(err)
  //
  //         comissionExchange(tx, this, (err) => {
  //           if (err) return callback(err)
  //           return callback(null, tx.data)
  //         })
  //       })
  //   })
  // })
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
