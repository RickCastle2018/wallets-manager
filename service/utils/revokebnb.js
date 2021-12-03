import UserWallet from '../wallets/userwallet.js'
import web3 from '../blockchain/web3.js'
import BigNumber from 'bignumber.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import { gameWallet } from '../wallets/gamewallet.js'

function revokeUW (uW, cb) {
  uW.getBalance((err, b) => {
    if (err) return cb(err)

    transferBNB('revokeBNB' + uW.idInGame, uW, gameWallet.address, '0.000001',
      async (err, tx) => {
        if (err) return cb(err)

        const balance = new BigNumber(web3.utils.fromWei(b))
        const sendAmount = balance.minus(0.001 + tx.data.fee.bnb)
        if (sendAmount.isGreaterThan(0.001)) {
          console.log('revoking' + uW.idInGame)
          transferBNB('revokeBNB' + uW.idInGame, uW, gameWallet.address, sendAmount.toString(),
            (err, tx) => {
              if (err) return cb(err)
              tx.execute(err => {
                cb(err)
              })
            })
        }
      })
  })
}

function revokeBNB () {
  return new Promise((resolve, reject) => {
    UserWallet.find({}, (err, userwallets) => {
      if (err) return reject(err.message)
      userwallets.forEach(uW => {
        revokeUW(uW, (err) => {
          if (err) return reject(err)
        })
      })
      resolve()
    })
  })
}

revokeBNB().then(
  s => console.log,
  e => console.log
)
