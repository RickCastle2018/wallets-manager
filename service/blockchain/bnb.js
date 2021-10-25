import Tx from '../wallets/transaction.js'
import web3 from './web3.js'

export function transfer (txId, fromUser, toAddress, amount, callback) {
  web3.eth.getTransactionCount(fromUser.address, (err, txCount) => {
    if (err) return callback(err)

    web3.eth.getGasPrice().then((gasPrice) => {
      const measureTx = {
        from: fromUser.address,
        nonce: web3.utils.toHex(txCount),
        to: toAddress,
        value: web3.utils.toHex(amount),
        chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
        gasPrice: web3.utils.toHex(gasPrice)
      }

      web3.eth.estimateGas(measureTx).then((estimateGas) => {
        const txObject = {
          from: fromUser.address,
          nonce: web3.utils.toHex(txCount + txId),
          to: toAddress,
          value: web3.utils.toHex(amount),
          chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
          gasPrice: web3.utils.toHex(gasPrice),
          gasLimit: web3.utils.toHex(Math.round(estimateGas + (estimateGas * 0.2)))
        }

        const tx = new Tx(txId, fromUser.privateKey, txObject)
        callback(null, tx)
      },
      (err) => {
        callback(err)
      })
    })
  })
}
