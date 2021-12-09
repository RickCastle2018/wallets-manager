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

function getAndIncrementNonce (address, cb) {
  const nonce = nonceCache.take(address)
  if (nonce !== undefined) {
    cb(parseInt(nonce))
    return nonceCache.set(address, (parseInt(nonce) + 1).toString())
  }
  web3.eth.getTransactionCount(address, 'pending')
    .then((txCount) => {
      cb(parseInt(txCount))
      return nonceCache.set(address, (parseInt(txCount) + 1).toString())
    })
}

const common = Common.default.forCustomChain('mainnet', {
  name: 'bnb',
  networkId: process.env.BLOCKCHAIN_ID,
  chainId: process.env.BLOCKCHAIN_ID
}, 'petersburg')

function sendTx (tx, cb) {
  function executedState (tx, webhook) {
    tx.data.executed = true
    tx.data.result = webhook
    tx.enqueue(tx.data)
  }

  web3.eth.sendSignedTransaction(tx.raw)
    .once('transactionHash', function (hash) {
      requestedTransactions.set(hash, tx.id)
      console.log(tx.id)
    })
    .once('receipt', (receipt) => {
      if (cb) cb()

      const webhook = {
        transaction_id: tx.id,
        type: 'internal',
        successful: receipt.status,
        gasPaid: receipt.gasUsed,
        from: tx.data.from ? tx.data.from : '',
        to: tx.data.to ? tx.data.to : ''
      }

      executedState(tx, webhook)

      axios({
        method: 'post',
        url: process.env.WEBHOOKS_LISTENER,
        data: webhook
      })
    }).on('error', (error) => {
      if (cb) cb(error)

      web3.eth.getTransactionCount(tx.txObject.from, 'pending')
        .then((txCount) => {
          const nonce = nonceCache.take(tx.txObject.from)
          if (nonce !== txCount) {
            nonceCache.set(tx.txObject.from, txCount.toString())
          }
        })

      const webhook = {
        transaction_id: tx.id,
        type: 'internal',
        successful: false,
        error: error.message
      }

      executedState(tx, webhook)

      axios({
        method: 'post',
        url: process.env.WEBHOOKS_LISTENER,
        data: webhook
      }).catch(err => {
        logger.error(err)
      })
    })
}

function executeBefore (txs, i, cb) {
  if (txs[i] === undefined) cb()

  const tx = txStorage.get(txs[i])
  if (tx === undefined) {
    const err = `executeBefore tx ${txs[i]} not found!`
    logger.error(err)
    cb(new Error(err))
  } else {
    tx.execute(err => {
      const callback = cb
      if (err) {
        const info = `executeBefore ${tx.id} failed: `
        logger.error(info, err)
        callback(new Error(err))
        return
      }
      executeBefore(txs, i + 1)
    })
  }
}

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

  execute (cb) {
    getAndIncrementNonce(this.txObject.from, (txCount) => {
      this.txObject.nonce = txCount

      const tx = ethertx.Transaction.fromTxData(this.txObject, {
        common
      })
      const pK = Buffer.from(this.privateKey.slice(2), 'hex')
      const signedTx = tx.sign(pK)
      const serializedTrans = signedTx.serialize()
      this.raw = '0x' + serializedTrans.toString('hex')

      if (this.data.executeBefore) {
        executeBefore(this.data.executeBefore, 0, err => {
          if (err) {
            if (cb) cb(err)
            return logger.error(`executeBefore ${this.id} failed: `, err)
          }
          sendTx(this, err => {
            if (cb) cb(err)
          })
        })
      } else {
        sendTx(this, err => {
          console.log(this.id)
          if (cb) cb(err)
        })
      }
    })
  }
}
