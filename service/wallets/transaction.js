import NodeCache from 'node-cache'
import ethertx from '@ethereumjs/tx'
import axios from 'axios'
import Common from '@ethereumjs/common'
import web3 from '../blockchain/web3.js'
import { requestedTransactions } from './refills.js'
import logger from '../utils/logger.js'

export const txStorage = new NodeCache({
  stdTTL: 300,
  checkperiod: 150
})

export const nonceCache = new NodeCache({
  checkperiod: 0,
  deleteOnExpire: false
})

function getAndIncrementNonce (address, callback) {
  const nonce = nonceCache.take(address)
  if (nonce !== undefined) {
    callback(parseInt(nonce))
    nonceCache.set(address, (parseInt(nonce) + 1).toString())
    return
  }
  web3.eth.getTransactionCount(address, 'pending')
    .then((txCount) => {
      callback(parseInt(txCount))
      nonceCache.set(address, (parseInt(txCount) + 1).toString())
    })
}

const common = Common.default.forCustomChain('mainnet', {
  name: 'bnb',
  networkId: process.env.BLOCKCHAIN_ID,
  chainId: process.env.BLOCKCHAIN_ID
}, 'petersburg')

export default class Tx {
  constructor (txId, privateKey, txObject) {
    this.id = txId
    this.privateKey = privateKey
    this.txObject = txObject

    return this
  }

  enqueue (extra) {
    this.data = extra
    txStorage.set(this.id, this)
  }

  cancel () {
    txStorage.del(this.id)
  }

  execute (callback) {
    getAndIncrementNonce(this.txObject.from, (txCount) => {
      this.txObject.nonce = txCount

      const tx = ethertx.Transaction.fromTxData(this.txObject, {
        common
      })
      const pK = Buffer.from(this.privateKey.slice(2), 'hex')
      const signedTx = tx.sign(pK)
      const serializedTrans = signedTx.serialize()
      this.raw = '0x' + serializedTrans.toString('hex')

      web3.eth.sendSignedTransaction(this.raw)
        .once('transactionHash', function (hash) {
          requestedTransactions.set(hash, this.id)
        })
        .once('receipt', (receipt) => {
          if (callback) callback()

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
          if (callback) callback(error)

          web3.eth.getTransactionCount(this.txObject.from, 'pending')
            .then((txCount) => {
              const nonce = nonceCache.take(this.txObject.from)
              if (nonce !== txCount) {
                nonceCache.set(this.txObject.from, txCount.toString())
              }
            })

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
          }).catch(err => {
            logger.error(err)
          })
        })
    })
  }
}
