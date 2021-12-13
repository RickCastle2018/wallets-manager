import { txStorage } from '../wallets/transaction.js'

export function middleware (req, res, next) {
  const tx = txStorage.get(req.params.txId)
  if (tx !== undefined) {
    req.tx = tx
    return next()
  }
  return res.status(404).send('tx not found')
}

export function get (req, res) {
  res.send(req.tx.data)
}

export function cancel (req, res) {
  req.tx.cancel()
  res.send(req.tx)
}

export function proceed (req, res) {
  req.tx.execute()
  res.status(200).send()
}
