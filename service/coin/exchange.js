import BigNumber from 'bignumber.js'
import web3 from '../blockchain/web3.js'
import logger from '../utils/logger.js'
import { transfer as transferBNB } from '../blockchain/bnb.js'
import { transfer as transferCoin } from '../coin/coin.js'
import { load as loadGameWallet } from '../wallets/gamewallet.js'

BigNumber.set({
  DECIMAL_PLACES: 17,
  EXPONENTIAL_AT: 1e+9
})

const bnbRate = parseInt(process.env.BNB_PRICE)
const exchangeFee = parseFloat(process.env.EXCHANGE_FEE)

function checkLimits (gameWallet, userWallet, amountWei) {
  // game-wallet checkLimits
  gameWallet.getBalance((err, b) => {
    if (err) return logger.error(err)
    const percentOfPool = 100 / (gameWallet.exchangePool / amountWei)
    if (percentOfPool <= 51) return true
    return false
  })
}

export default function exchange (txIds, user, amountWei, currencyFrom, cb) {
  loadGameWallet((gW) => {
    gW.getBalance(b => {
      let bigAmount = new BigNumber(web3.utils.fromWei(amountWei))
      bigAmount = bigAmount.minus(bigAmount.multipliedBy(exchangeFee))
      const ourFee = bigAmount.multipliedBy(exchangeFee)

      switch (currencyFrom) {
        case 'bnb': {
          const coinsToSend = web3.utils.toWei(bigAmount.multipliedBy(bnbRate).minus(ourFee).toString())
          const bnbToTake = web3.utils.toWei(bigAmount.toString())

          transferCoin(
            txIds[0],
            gW,
            user.address,
            coinsToSend,
            (err, tx) => {
              if (err) return cb(err)

              transferBNB(
                txIds[1],
                user,
                gW.address,
                bnbToTake,
                (err, tx) => {
                  if (err) return cb(err)
                  cb()
                }
              )
            }
          )
          break
        }
        case 'oglc': {
          if (!checkLimits(gW, user, amountWei)) return cb(new Error('game-wallet bnb daily exchange limit reached'))

          const bnbToSend = web3.utils.toWei(bigAmount.dividedBy(bnbRate).minus(ourFee).toString())
          const coinToTake = web3.utils.toWei(bigAmount.toString())

          transferCoin(
            txIds[0],
            user,
            gW.address,
            coinToTake,
            (err, tx) => {
              if (err) return cb(err)

              const gameWallet = gW
              transferBNB(
                txIds[1],
                gW,
                user.address,
                bnbToSend,
                (err, tx) => {
                  if (err) return cb(err)
                  gameWallet.poolDecrease(bnbToSend)
                  cb()
                }
              )
            }
          )
          break
        }
      }
    })
  })
}
