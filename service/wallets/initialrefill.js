import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import coin from '../coin/coin.js'
import { load as loadUserWallet } from './userwallet.js'
import { load as loadGameWallet } from './gamewallet.js'

export default function initialRefill (idInGame, callback) {
  loadGameWallet((gW) => {
    loadUserWallet(idInGame, (err, uW) => {
      if (err) { console.log('1', err); return callback(err) }

      uW.getBalance((err, balance) => {
        if (err) { console.log('2', err); return callback(err) }

        coin.methods.transfer(gW.address, new web3.utils.BN(web3.utils.toWei('0'))).estimateGas({
          from: uW.address
        })
          .then((gasAmount) => {
            web3.eth.getGasPrice().then((gasPrice) => {
              const initialAmount = web3.utils.toWei(Math.round(gasAmount * web3.utils.fromWei(gasPrice, 'gwei') * 2).toString(), 'gwei')

              if (web3.utils.fromWei(balance.bnb) < web3.utils.fromWei(initialAmount)) {
                transferBNB('initialRefill' + uW.idInGame, gW, uW.address, initialAmount,
                  (err, tx) => {
                    if (err) { console.log('3', err); return callback(err) }

                    tx.execute((err) => {
                      if (err) { console.log('4', err); return callback(err) }
                      return callback()
                    })
                  })
              } else {
                return callback()
              }
            })
          })
          .catch((err) => {
            callback(err)
          })
      })
    })
  })
}
