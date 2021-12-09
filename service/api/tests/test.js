// the main integration test engine (semi-automatic)

// Put 1 BNB 1 test-OGLC into the game-wallet and user-wallet (id: 1)
// Run: `sudo node test.js`, check - test passed if there no errs (and webhooks received)

// `sudo` needed to test webhooks (expose 80 port), but not required
// if you want to see service responces - `(sudo) node test.js full`
// if you want to run exact testcase - `(sudo) node test.js full/short filename.json`

import { readFileSync, readdirSync } from 'fs'
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

  const handleName = new URL(handles[i].url).pathname
  axios({
    method: handles[i].method,
    url: handles[i].url,
    data: ('data' in handles[i]) ? handles[i].data : undefined
  })
    .then(res => {
      if (res.status === 200) {
        console.log(`ok: ${handles[i].method} ${handleName}`)
        if (process.argv[2] === 'full') console.log(res.data)
        test(handles, i + 1)
      }
    })
    .catch(err => {
      if (!err.response) return console.log(`service down! fatal ${handles[i].method} ${handleName}`)
      console.log(`err: ${handles[i].method} ${handleName}`, err.response.data)
      test(handles, i + 1)
    })
}

function start (webhooks) {
  let handles = []
  if (process.argv[3]) {
    const filename = process.argv[3]
    handles = JSON.parse(readFileSync('./' + filename, 'utf8'))
  } else {
    const files = readdirSync('./')
    files.forEach(f => {
      const i = f.charAt(0)
      const sortedFiles = []
      if (!isNaN(parseInt(i))) {
        sortedFiles[i - 1] = JSON.parse(readFileSync('./' + f, 'utf8'))
      }
      sortedFiles.forEach(f => {
        f.forEach(t => {
          handles.push(t)
        })
      })
    })
  }

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
