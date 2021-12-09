import { readFileSync } from 'fs'
import Tx from '../wallets/transaction.js'
import web3 from '../blockchain/web3.js'
import { gasToBNB } from '../utils/calculations.js'

const abi = JSON.parse(readFileSync('./coin/contracts/oglc.json', 'utf8'))
const coin = new web3.eth.Contract(abi, process.env.COIN_CONTRACT)
export default coin

export function transfer (txId, fromUser, toAddress, amount, cb) {
  web3.eth.getGasPrice().then((gasPrice) => {
    coin.methods.transfer(toAddress, new web3.utils.BN(amount)).estimateGas({
      from: fromUser.address
    },
    async (err, estimatedGas) => {
      if (err) return cb(err)

      const data = coin.methods.transfer(toAddress, new web3.utils.BN(amount)).encodeABI()
      const txObject = {
        from: fromUser.address,
        to: process.env.COIN_CONTRACT,
        data: data,
        value: web3.utils.toHex(0),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(100000),
        gas: estimatedGas
      }

      const tx = new Tx(txId, fromUser.privateKey, txObject)

      const bnbGas = await gasToBNB(estimatedGas, gasPrice)
      tx.enqueue({
        from: fromUser.address,
        to: toAddress,
        currency: 'oglc',
        amount: amount,
        fee: {
          bnb: bnbGas,
          oglc: (bnbGas * process.env.BNB_PRICE).toString()
        },
        executed: false
      })

      cb(null, tx)
    })
  })
}
