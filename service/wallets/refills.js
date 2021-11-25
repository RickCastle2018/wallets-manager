import axios from 'axios'
import NodeCache from 'node-cache'
import coin from '../coin/coin.js'
import UserWallet, { loadByAddr as loadUserWalletId } from './userwallet.js'
import logger from '../utils/logger.js'

export const requestedTransactions = new NodeCache({
  checkperiod: 0,
  deleteOnExpire: false
})

export let usersAddrs
async function init () {
  const users = await UserWallet.find({}, 'address -_id')
  usersAddrs = []
  users.forEach(u => {
    usersAddrs.push(u.address)
  })
}

export async function listenRefills () {
  await init()

  const options = {
    filter: {
      to: usersAddrs
    },
    fromBlock: 'latest'
  }

  function processEvent (e) {
    if (requestedTransactions.get(e.transactionHash) === undefined) {
      loadUserWalletId(e.returnValues.to, (err, uW) => {
        if (err) logger.error(err)
        if (uW) {
          uW.getBalance(b => {
            const webhook = {
              transaction_id: 0,
              type: 'external',
              from: e.returnValues.from,
              to: {
                id: uW.idInGame,
                balance: b,
                address: uW.address
              }
            }

            axios({
              method: 'post',
              url: process.env.WEBHOOKS_LISTENER,
              data: webhook
            }).catch(err => {
              logger.error(err)
            })
          })
        }
      })
    }
  }

  setInterval(() => {
    coin.getPastEvents('Transfer', options,
      (err, events) => {
        if (err) return logger.error(err)
        // TODO: test this all console.log(events)
        events.forEach(e => processEvent)
      })
  }, 3500) // 3.5 seconds
}
