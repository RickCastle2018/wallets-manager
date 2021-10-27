// the main integration test
// before running, request 1 BNB in the testnet faucet to the user-wallets/1 (and 1 OGLC too, if you want to test coin)
// sudo node test.js

import express from 'express'
import axios from 'axios'

const app = express()
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

app.post('/wallets-manager', (req) => {
  console.log(req.body)
})

app.listen(80, () => {
  function test (handles) {
    handles.forEach(async (handle) => {
      try {
        const res = await axios({
          method: handle.method,
          url: handle.url,
          data: ('data' in handle) ? handle.data : undefined
        })
        console.log(res.data)
      } catch (err) {
        console.error(err.response.data)
      }
    })
  }

  test([
    {
      method: 'get',
      url: 'http://127.0.0.1:2311/user-wallets/1'
    },
    {
      method: 'put',
      url: 'http://127.0.0.1:2311/user-wallets/1'
    },
    {
      method: 'get',
      url: 'http://127.0.0.1:2311/user-wallets/1'
    },
    {
      method: 'get',
      url: 'http://127.0.0.1:2311/game-wallet'
    },
    {
      method: 'post',
      url: 'http://127.0.0.1:2311/game-wallet/withdraw',
      data: {
        transaction_id: 1,
        amount: '900000000',
        to: 1, // idInGame
        currency: 'bnb' // oglc or bnb
      }
    },
    {
      method: 'get',
      url: 'http://127.0.0.1:2311/transactions/1'
    }
  ])
})
