import BigNumber from 'bignumber.js'
import exchange from '../coin/exchange.js'

BigNumber.set({
  DECIMAL_PLACES: 17,
  EXPONENTIAL_AT: 1e+9
})

export default function commissionExchange (tx, uW, cb) {
  const bnbFee = new BigNumber(tx.data.fee.bnb)
  const coinAmount = bnbFee.multipliedBy(2).multipliedBy(parseInt(process.env.BNB_PRICE))

  const idArr = [tx.id + 'c', tx.id + 'b']
  exchange(idArr, uW, coinAmount.toString(), 'oglc',
    (err) => {
      tx.data.executeBefore = idArr
      tx.enqueue(tx.data)

      return cb(err)
    })
}
