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
    if (err) res.status(500).send(err.message)
    res.send({
      address: req.gameWallet.address,
      balance: b
    })
  })
}

export function withdraw (req, res) {
  if (!req.body.currency) res.status(500).send('no currency provided')

  req.gameWallet.withdraw(req.body.transaction_id, req.body.currency, req.body.amount, req.body.to,
    (err) => {
      if (err) return res.status(500).send(err.message)
      return res.status(200).send()
    })
}

export function buy (req, res) {
  if (!req.body.currency) res.status(500).send('no currency provided')

  req.gameWallet.buy(req.body.transaction_id, req.body.currency, req.body.amount, req.body.from,
    (err) => {
      if (err) return res.status(500).send(err.message)
      return res.status(200).send()
    })
}
