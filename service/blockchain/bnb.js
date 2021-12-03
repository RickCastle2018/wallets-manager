import Tx from '../wallets/transaction.js'
import web3 from './web3.js'
import gasToBNB from '../utils/gastobnb.js'

export function transfer (txId, fromUser, toAddress, amount, cb) {
  web3.eth.estimateGas({
    from: fromUser.address,
    to: toAddress,
    value: web3.utils.toHex(amount)
  }).then((estimatedGas) => {
    web3.eth.getGasPrice()
      .then(async (gasPrice) => {
        const txObject = {
          from: fromUser.address,
          to: toAddress,
          value: web3.utils.toHex(amount),
          gasPrice: web3.utils.toHex(gasPrice),
          gasLimit: web3.utils.toHex(100000),
          gas: estimatedGas
        }

        const tx = new Tx(txId, fromUser.privateKey, txObject)

        const bnbGas = await gasToBNB(estimatedGas, gasPrice)
        tx.enqueue({
          from: fromUser.address,
          to: toAddress,
          currency: 'bnb',
          amount: amount,
          fee: {
            gas: estimatedGas,
            bnb: bnbGas,
            oglc: bnbGas * process.env.BNB_PRICE
          },
          executed: false
        })

        cb(null, tx)
      })
  },
  (err) => {
    cb(err)
  })
}
