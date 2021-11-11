import { readFileSync } from 'fs'
import Tx from '../wallets/transaction.js'
import web3 from '../blockchain/web3.js'

const abi = JSON.parse(readFileSync('./coin/contracts/oglc.json', 'utf8'))
const coin = new web3.eth.Contract(abi, process.env.COIN_CONTRACT)
export default coin

export function transfer (txId, fromUser, toAddress, amount, callback) {
  web3.eth.getGasPrice().then((gasPrice) => {
    const data = coin.methods.transfer(toAddress, new web3.utils.BN(amount)).encodeABI()

    const measureTx = {
      from: fromUser.address,
      to: process.env.COIN_CONTRACT,
      data: data,
      value: web3.utils.toHex(0),
      gasPrice: web3.utils.toHex(gasPrice),
      chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
      gasLimit: web3.utils.toHex(100000)
    }

    coin.methods.transfer(toAddress, new web3.utils.BN(amount)).estimateGas(measureTx,
      (err, estimatedGas) => {
        const txObject = {
          from: fromUser.address,
          to: process.env.COIN_CONTRACT,
          data: data,
          value: web3.utils.toHex(0),
          gasPrice: web3.utils.toHex(gasPrice),
          chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
          gasLimit: web3.utils.toHex(100000),
          gas: estimatedGas
        }

        if (err && err.message !== 'Returned error: insufficient funds for transfer') return callback(err)

        const tx = new Tx(txId, fromUser.privateKey, txObject)
        tx.enqueue({
          from: fromUser.address,
          to: toAddress,
          currency: 'oglc',
          amount: amount,
          fee: estimatedGas
        })

        callback(null, tx)
      })
  })
}
