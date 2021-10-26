import mongoose from 'mongoose'
import coin, { transfer as transferCoin } from '../coin/coin.js'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import exchange from '../coin/exchange.js' // also, used for OGLC commisions

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
  switch (currency) {
    case 'bnb':
      transferBNB(txId, this, recipientAddress, amount,
        (err, data) => {
          callback(err)
        })
      break
    case 'oglc':
      transferCoin(txId, this, recipientAddress, amount,
        (err) => {
          callback(err)
        })
      break
  }
}
userWalletSchema.methods.exchange = function (txIds, currencyFrom, amount, callback) {
  exchange(txIds, this, amount, currencyFrom,
    (err) => {
      callback(err)
    })
}
userWalletSchema.methods.getTestCoin = function (amount) {
  // TODO
}
const UserWallet = mongoose.model('UserWallet', userWalletSchema)
export default UserWallet

export function create (userIdInGame, callback) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err) => {
    if (err) {
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
    if (err) return callback()
    return callback(uW)
  })
}

export function loadByAddr (addr, callback) {
  UserWallet.findOne({
    address: addr
  }, (err, uW) => {
    if (err) return callback()
    return callback(uW)
  })
}
