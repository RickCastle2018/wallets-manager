import BigNumber from '../utils/calculations.js'
import exchange from '../coin/exchange.js'

export default function commissionExchange (tx, uW, cb) {
  const bnbFee = new BigNumber(tx.data.fee.bnb)
  const coinAmount = bnbFee.multipliedBy(2).multipliedBy(parseInt(process.env.BNB_PRICE))

  // TODO: FIX THIS SHIT
  const idArr = [tx.id + 'c', tx.id + 'b']
  exchange(idArr, uW, coinAmount.toString(), 'oglc',
    (err) => {
      tx.data.executeBefore = idArr
      tx.enqueue(tx.data)

      return cb(err)
    })
}
