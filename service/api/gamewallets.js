import {
  load as loadGameWallet
} from '../wallets/gamewallet.js'

// game-wallets

export function middleware (req, res, next) {
  loadGameWallet((gW) => {
    req.gameWallet = gW
    next()
  })
}

export function get (req, res) {
  req.gameWallet.getBalance((err, b) => {
    if (err) return res.status(500).send(err.message)
    res.send({
      address: req.gameWallet.address,
      balance: b
    })
  })
}

export function withdraw (req, res) {
  if (!req.body.currency) return res.status(500).send('no currency provided')

  req.gameWallet.withdraw(req.body.transaction_id, req.body.currency, req.body.amount, req.body.to,
    (err, data) => {
      if (err) return res.status(500).send(err.message)
      res.status(200).send(data)
    })
}

export function buy (req, res) {
  if (!req.body.currency) return res.status(500).send('no currency provided')

  req.gameWallet.buy(req.body.transaction_id, req.body.currency, req.body.amount, req.body.from,
    (err, data) => {
      if (err) return res.status(500).send(err.message)
      res.status(200).send(data)
    })
}

// function profit (req, res) {
//   if (!req.body.currency) return res.status(500).send('no currency provided')

//   req.gameWallet.profit(req.body.transaction_id, req.body.currency, req.body.percent)
// }
