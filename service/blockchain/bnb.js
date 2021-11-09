import Tx from '../wallets/transaction.js'
import web3 from './web3.js'

export function transfer (txId, fromUser, toAddress, amount, callback) {
  web3.eth.getGasPrice().then((gasPrice) => {
    const measureTx = {
      from: fromUser.address,
      to: toAddress,
      value: web3.utils.toHex(amount),
      chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
      gasPrice: web3.utils.toHex(gasPrice)
    }

    web3.eth.estimateGas(measureTx).then((estimatedGas) => {
      const txObject = {
        from: fromUser.address,
        to: toAddress,
        value: web3.utils.toHex(amount),
        chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(100000),
        gas: estimatedGas
      }

      const tx = new Tx(txId, fromUser.privateKey, txObject)
      tx.enqueue({
        from: fromUser.address,
        to: toAddress,
        currency: 'oglc',
        amount: amount,
        fee: estimatedGas
      })

      callback(null, tx)
    },
    (err) => {
      callback(err)
    })
  })
}
