import BigNumber from 'bignumber.js'
import web3 from '../blockchain/web3.js'
import exchange from '../coin/exchange.js'

export default function commissionExchange (tx, uW, callback) {
  web3.eth.getGasPrice().then((gasPrice) => {
    let bnbFee = tx.data.fee * web3.utils.fromWei(gasPrice, 'gwei') * 1.01
    bnbFee = new BigNumber(web3.utils.toWei(Math.round(bnbFee).toString(), 'gwei'))
    const coinAmount = bnbFee.multipliedBy(2).multipliedBy(parseInt(process.env.BNB_PRICE))

    exchange([tx.id + 'c', tx.id + 'b'], uW, coinAmount.toString(), 'oglc',
      (err) => {
        return callback(err)
      })
  })
}
