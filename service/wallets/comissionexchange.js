import BigNumber from 'bignumber.js'
import web3 from '../blockchain/web3.js'
import exchange from '../coin/exchange.js'

export default function comissionExchange (tx, uW, callback) {
  web3.eth.getGasPrice().then((gasPrice) => {
    const bnbFee = new BigNumber(web3.utils.toWei((tx.data.fee * gasPrice).toString(), 'gwei'))
    const coinAmount = bnbFee.multipliedBy(2).multipliedBy(parseInt(process.env.BNB_PRICE))

    console.log('FUCK: ', bnbFee.toString(), ' ', coinAmount.toString())

    exchange([tx.id + 'c', tx.id + 'b'], uW, coinAmount.toString(), 'oglc', (err) => {
      return callback(err)
    })
  })
}
