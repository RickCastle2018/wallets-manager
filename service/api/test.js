// the main integration test engine (semi-automatic)
// before running, request 1 BNB in the faucet testnet and put 1 test-OGLC into the game-wallet
// `sudo node test.js`, check - test passed if there no errs (and webhooks received)
// `sudo` needed to test webhooks (expose 80 port)
// if you want to see service responces - `(sudo) node test.js full`
// if you want to run another testcases - `(sudo) node test.js full/short filename.json`

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
    if (process.argv[2] === 'full') console.log(req.body)
  }
})

function test (handles, i) {
  if (handles[i] === undefined) return console.log('all requests sended, check webhooks')

  axios({
    method: handles[i].method,
    url: handles[i].url,
    data: ('data' in handles[i]) ? handles[i].data : undefined
  })
    .then(res => {
      if (res.status === 200) {
        console.log('ok: ', i + 1)
        if (process.argv[2] === 'full') console.log(res.data)
        test(handles, i + 1)
      }
    })
    .catch(err => {
      if (!err.response) return console.log(`service down! fatal ${i + 1}`)
      console.log(`err: ${i + 1}`, err.response.data)
      test(handles, i + 1)
    })
}

function start (webhooks) {
  let filename = 'test.json'
  if (process.argv[3]) filename = process.argv[3]

  const handles = JSON.parse(readFileSync('./' + filename, 'utf8'))
  console.log('Requests to test: ', handles.length)

  if (webhooks) console.log('Check webhooks, also.')

  test(handles, 0) // stunning recursive function!
}

app.listen(80, () => {
  start(true)
})
  .on('error', function (err) {
    console.log(err.message, '- webhooks wont be tested')
    start(false)
  })
