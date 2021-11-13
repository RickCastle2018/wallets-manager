import axios from 'axios'
import NodeCache from 'node-cache'
import coin from '../coin/coin.js'
import { loadByAddr as loadUserWalletId } from './userwallet.js'
import logger from '../utils/logger.js'

export const requestedTransactions = new NodeCache({
  checkperiod: 0,
  deleteOnExpire: false
})

export function listenRefills () {
  // TODO: Listen only for our user-wallets! Filter
  const options = {
    filter: {
      value: []
    },
    fromBlock: 0
  }
  coin.events.Transfer(options)
    .on('data', (t) => {
      loadUserWalletId(t.returnValues.to, (found, userWalletId) => {
        coin.methods.balanceOf(t.returnValues.to, (err, b) => {
          if (err) return logger.error(err)

          const webhook = {
            transaction_id: 0,
            type: 'refill',
            successful: true,
            user: {
              id: userWalletId,
              balance: b
            }
          }

          // TODO: rewrite for NodeCache
          if (!requestedTransactions.includes(t.transactionHash) && found) {
            axios({
              method: 'post',
              url: process.env.WEBHOOKS_LISTENER,
              data: webhook
            })
          }

          const txli = requestedTransactions.indexOf(t.H)
          if (txli !== -1) {
            requestedTransactions.split(txli, 1)
          }
        })
      })
    })
    .on('error', (err) => {
      logger.error(err)
    })
}
