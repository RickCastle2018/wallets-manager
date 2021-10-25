import BigNumber from 'bignumber.js'
import web3 from '../blockchain/web3.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import { transfer as transferCoin } from '../coin/coin.js'
import { load as loadGameWallet } from '../wallets/gameWallet.js'

const bnbRate = parseInt(process.env.BNB_PRICE)
const exchangeFee = parseFloat(process.env.EXCHANGE_FEE)

export default function exchange (txIds, user, amountWei, currencyFrom, callback) {
  let bigAmount = new BigNumber(web3.utils.fromWei(amountWei))
  bigAmount = bigAmount.minus(bigAmount.multipliedBy(exchangeFee))

  switch (currencyFrom) {
    case 'bnb': {
      const coinsToSend = web3.utils.toWei(bigAmount.multipliedBy(bnbRate))
      const bnbToTake = web3.utils.toWei(bigAmount)

      loadGameWallet((gW) => {
        transferCoin(
          txIds[0],
          gW,
          user.address,
          coinsToSend,
          (err) => {
            callback(err)
          }
        )

        transferBNB(
          txIds[1],
          user,
          gW.address,
          bnbToTake,
          (err) => {
            callback(err)
          }
        )
      })
      break
    }
    case 'oglc': {
      const bnbToSend = web3.utils.toWei(bigAmount.dividedBy(bnbRate))
      const coinToTake = web3.utils.toWei(bigAmount)

      loadGameWallet((gW) => {
        transferCoin(
          txIds[0],
          user,
          gW.address,
          coinToTake,
          (err) => {
            callback(err)
          }
        )

        transferBNB(
          txIds[1],
          gW,
          user.address,
          bnbToSend,
          (err) => {
            callback(err)
          }
        )
      })
      break
    }
  }

  callback()
}
