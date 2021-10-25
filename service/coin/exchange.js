import BigNumber from 'bignumber.js'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import { transfer as transferCoin } from '../coin/coin.js'
import { load as loadUserWallet } from '../wallets/userwallet.js'
import { load as loadGameWallet } from '../wallets/gameWallet.js'

export const bnbRate = process.env.BNB_PRICE

export default function calculate (txIDs, amountWei, currencyFrom, callback) {
  const bigAmount = new BigNumber(web3.utils.fromWei(amountWei))

  loadGameWallet((gW) => {
    if (currencyFrom == 'bnb') {
      const bnb = bigCoins.divn(parseInt(bnbRate)) // .ne
    } else {
      const coins = bigBNB.mul(process.env.BNB_PRICE).neg(bigBNB.mul(process.env.EXCHANGE_FEE))
    }

    callback()

    transferBNB(txIDs[0], this, gW, bnb, {
      id: gameTransactionId,
      user: this,
      type: 'exchange',
      dry: true
    }, (err) => {
      if (!err) {
        transferCoin(gW, this, coins, {
          id: gameTransactionId,
          user: this,
          type: 'exchange',
          dry: true
        }, (err) => {
          if (!err) {
            callback(undefined, {
              amount: bnb.toString(),
              fee: bigCoins.divn(100).muln(parseInt(process.env.EXCHANGE_FEE)).toString()
            })
          } else {
            callback(err)
          }
        })
      } else {
        callback(err)
      }
    })
  })

  loadGameWallet((gW) => {
    const sender = {}
    if (transaction.currency === 'bnb') {
      sender.bnb = this
      sender.oglc = gW
    } else {
      sender.bnb = gW
      sender.oglc = this
    }

    transferBNB(sender.bnb, sender.oglc, transaction.bnb, {
      id: transaction.id,
      user: this,
      type: 'exchange',
      dry: false
    }, (err) => {
      callback(err)
    })

    transferCoin(sender.oglc, sender.bnb, transaction.oglc, {
      id: transaction.id,
      user: this,
      type: 'exchange',
      dry: false
    }, (err) => {
      callback(err)
    })

    callback()
  })
}
