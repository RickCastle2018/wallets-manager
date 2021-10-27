import NodeCache from 'node-cache'
import ethertx from '@ethereumjs/tx'
import axios from 'axios'
import Common from '@ethereumjs/common'
import web3 from '../blockchain/web3.js'
import { requestedTransactions } from './refills.js'

export const txStorage = new NodeCache({
  stdTTL: 300,
  checkperiod: 150
})

const common = Common.default.forCustomChain('mainnet', {
  name: 'bnb',
  networkId: process.env.BLOCKCHAIN_ID,
  chainId: process.env.BLOCKCHAIN_ID
}, 'petersburg')

export default class Tx {
  constructor (txId, privateKey, txObject) {
    this.id = txId

    const tx = ethertx.Transaction.fromTxData(txObject, {
      common
    })
    const pK = Buffer.from(privateKey.slice(2), 'hex')
    const signedTx = tx.sign(pK)
    const serializedTrans = signedTx.serialize()
    this.raw = '0x' + serializedTrans.toString('hex')

    return this
  }

  enqueue (extra) {
    this.data = extra
    txStorage.set(this.id, this)
  }

  cancel () {
    txStorage.del(this.id)
  }

  execute () {
    web3.eth.sendSignedTransaction(this.raw)
      .once('transactionHash', function (hash) {
        requestedTransactions.set(hash, this.id)
      })
      .once('receipt', (receipt) => {
        const webhook = {
          transaction_id: this.id,
          type: 'internal',
          successful: receipt.status,
          gasPaid: receipt.gasUsed,
          from: this.data.from ? this.data.from : '',
          to: this.data.to ? this.data.to : ''
        }

        axios({
          method: 'post',
          url: process.env.WEBHOOKS_LISTENER,
          data: webhook
        })
      }).on('error', (error) => {
        const webhook = {
          transaction_id: this.id,
          type: 'internal',
          successful: false,
          error: error.message
        }

        axios({
          method: 'post',
          url: process.env.WEBHOOKS_LISTENER,
          data: webhook
        })
      })
  }
}
