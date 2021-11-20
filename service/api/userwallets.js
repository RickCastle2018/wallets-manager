import {
  create as createUserWallet,
  load as loadUserWallet,
  loadByAddr as loadUserWalletByAddress
} from '../wallets/userwallet.js'
import web3 from '../blockchain/web3.js'

export function create (req, res) {
  createUserWallet(req.params.idInGame, (err, uW) => {
    if (err) return res.send(err.message)
    res.send({
      address: uW.address
    })
  })
}

export function middleware (req, res, next) {
  if (web3.utils.isAddress(req.params.idInGame)) {
    loadUserWalletByAddress(req.params.idInGame, (err, uW) => {
      if (err) return res.status(500).send(err.message)
      if (uW) {
        req.userWallet = uW
        return next()
      }
      return res.status(404).send('user-wallet not found')
    })
  } else {
    loadUserWallet(req.params.idInGame, (err, uW) => {
      if (err) return res.status(500).send(err.message)
      if (uW) {
        req.userWallet = uW
        return next()
      }
      return res.status(404).send('user-wallet not found')
    })
  }
}

export function get (req, res) {
  req.userWallet.getBalance((err, b) => {
    if (err) return res.status(500).send(err.message)
    res.send({
      id: req.userWallet.idInGame,
      address: req.userWallet.address,
      balance: b
    })
  })
}

export function withdraw (req, res) {
  if (!req.body.currency) return res.status(500).send('no currency provided')

  req.userWallet.withdraw(req.body.transaction_id, req.body.currency, req.body.amount, req.body.to, (err, data) => {
    if (err) return res.status(500).send(err.message)
    res.status(200).send(data)
  })
}

export function getExchange (req, res) {
  res.send({
    bnbPrice: process.env.BNB_PRICE,
    exchangeFee: process.env.EXCHANGE_FEE
  })
}

export function exchange (req, res) {
  if (!req.body.currency) return res.status(500).send('no currency provided')

  req.userWallet.exchange(req.body.transaction_id, req.body.currency, req.body.amount, (err) => {
    if (err) return res.status(500).send(err.message)
    res.status(200).send()
  })
}

// export function buy (req, res) {
//   if (!req.body.currency) return res.status(500).send('no currency provided')
//
//   req.userWallet.buy
// }
