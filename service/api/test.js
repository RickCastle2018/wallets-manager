// the main integration test engine (semi-automatic)
// before running, request 1 BNB in the faucet testnet and put 1 test-OGLC into the game-wallet
// sudo node test.js, check - test passed if there no errs (and webhooks received)

import { readFileSync } from 'fs'
import express from 'express'
import axios from 'axios'

const app = express()
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

app.post('/wallets-manager', (req) => {
  if (req.body.error !== undefined) {
    console.log(`webhook err: ${req.body.transaction_id}`, req.body.error)
  } else {
    console.log('webhook ok: ', req.body.transaction_id)
  }
})

app.listen(80, (testsPassed, failedTests) => {
  function test (handles, i) {
    if (handles[i] === undefined) return

    axios({
      method: handles[i].method,
      url: handles[i].url,
      data: ('data' in handles[i]) ? handles[i].data : undefined
    })
      .then(res => {
        if (res.status === 200) {
          console.log(`ok: ${i + 1}`)
          test(handles, i + 1)
        }
      })
      .catch(err => {
        console.error(`err: ${i + 1}`, err.response.data)
        test(handles, i + 1)
      })
  }

  const handles = JSON.parse(readFileSync('./test.json', 'utf8'))

  let webhooksCount = 0
  handles.forEach(handle => {
    if ('data' in handle) webhooksCount++
  })
  console.log('Requests to test: ', handles.length, ', ', webhooksCount, 'webhooks should be received')

  test(handles, 0) // stunning recursive function!
})
