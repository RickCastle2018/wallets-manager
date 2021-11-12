import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import { load as loadUserWallet } from './userwallet.js'
import { load as loadGameWallet } from './gamewallet.js'

export default function initialRefill (idInGame, callback) {
  loadGameWallet((gW) => {
    loadUserWallet(idInGame, (err, uW) => {
      if (err) return callback(err)

      uW.getBalance((err, balance) => {
        if (err) return callback(err)

        if (web3.utils.fromWei(balance.bnb) < 0.0004) {
          transferBNB('initialRefill' + uW.idInGame, gW, uW.address, web3.utils.toWei('0.0004'),
            (err, tx) => {
              if (err) return callback(err)
              tx.execute((err) => {
                if (err) return callback(err)
                callback()
              })
            })
        } else {
          return callback()
        }
      })
    })
  })
}
