import BigNumber from 'bignumber.js'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import { transfer as transferCoin } from '../coin/coin.js'
import { load as loadGameWallet } from '../wallets/gamewallet.js'

const bnbRate = parseInt(process.env.BNB_PRICE)
const exchangeFee = parseFloat(process.env.EXCHANGE_FEE)

export default function exchange (txIds, user, amountWei, currencyFrom, callback) {
  let bigAmount = new BigNumber(web3.utils.fromWei(amountWei))
  bigAmount = bigAmount.minus(bigAmount.multipliedBy(exchangeFee))

  switch (currencyFrom) {
    case 'bnb': {
      const coinsToSend = web3.utils.toWei(bigAmount.multipliedBy(bnbRate).toFixed(14).toString())
      const bnbToTake = web3.utils.toWei(bigAmount.toFixed(14).toString())

      loadGameWallet((gW) => {
        transferCoin(
          txIds[0],
          gW,
          user.address,
          coinsToSend,
          (err, tx) => {
            if (err) return callback(err)
            tx.execute()

            transferBNB(
              txIds[1],
              user,
              gW.address,
              bnbToTake,
              (err, tx) => {
                if (err) return callback(err)
                callback()
                tx.execute()
              }
            )
          }
        )
      })
      break
    }
    case 'oglc': {
      const bnbToSend = web3.utils.toWei(bigAmount.dividedBy(bnbRate).toFixed(14).toString())
      const coinToTake = web3.utils.toWei(bigAmount.toFixed(14).toString())

      loadGameWallet((gW) => {
        transferCoin(
          txIds[0],
          user,
          gW.address,
          coinToTake,
          (err, tx) => {
            if (err) return callback(err)
            tx.execute()

            transferBNB(
              txIds[1],
              gW,
              user.address,
              bnbToSend,
              (err, tx) => {
                if (err) return callback(err)
                callback()
                tx.execute()
              }
            )
          }
        )
      })

      break
    }
  }
}
