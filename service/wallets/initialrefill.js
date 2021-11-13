import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import { transfer as transferCoin } from '../coin/coin.js'
import { load as loadUserWallet } from './userwallet.js'
import { load as loadGameWallet } from './gamewallet.js'

export default function initialRefill (idInGame, callback) {
  loadGameWallet((gW) => {
    loadUserWallet(idInGame, (err, uW) => {
      if (err) return callback(err)

      console.log(1, err)

      transferCoin('initialRefillCalculate' + uW.idInGame, uW, gW.address, web3.utils.toWei('1'),
        (err, tx) => {
          if (err) return callback(err)

          console.log(2, tx.data)

          // tx.data.fee
          web3.eth.getGasPrice().then((gasPrice) => {
            uW.getBalance((err, balance) => {
              if (err) return callback(err)

              console.log(tx.data.fee * gasPrice, gasPrice)

              const initialAmount = web3.utils.toWei((tx.data.fee * gasPrice).toString(), 'gwei')

              console.log('iA ', initialAmount)

              if (web3.utils.fromWei(balance.bnb) < web3.utils.fromWei(initialAmount)) {
                console.log(4)
                transferBNB('initialRefill' + uW.idInGame, gW, uW.address, initialAmount,
                  (err, tx) => {
                    console.log(web3.utils.toWei(initialAmount, 'gwei'), 'err ', err)
                    if (err) return callback(err)

                    console.log(5, err)

                    tx.execute((err) => {
                      console.log(6, err)

                      if (err) return callback(err)
                      return callback()
                    })
                  })
              } else {
                console.log(6)
                return callback()
              }
            })
          })
        })
    })
  })
}
