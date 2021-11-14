import Tx from '../wallets/transaction.js'
import web3 from './web3.js'

export function transfer (txId, fromUser, toAddress, amount, callback) {
  web3.eth.estimateGas({
    from: fromUser.address,
    to: toAddress,
    value: web3.utils.toHex(amount)
  }).then((estimatedGas) => {
    web3.eth.getGasPrice().then((gasPrice) => {
      const txObject = {
        from: fromUser.address,
        to: toAddress,
        value: web3.utils.toHex(amount),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(100000),
        gas: estimatedGas
      }

      const tx = new Tx(txId, fromUser.privateKey, txObject)
      tx.enqueue({
        from: fromUser.address,
        to: toAddress,
        currency: 'bnb',
        amount: amount,
        fee: estimatedGas
      })

      callback(null, tx)
    })
  },
  (err) => {
    callback(err)
  })
}
