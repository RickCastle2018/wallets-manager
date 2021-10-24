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
  const data = req.tx.data
  res.send({
    from: data.from,
    to: data.to,
    currency: data.currency,
    amount: data.amount,
    fee: data.fee
  })
}

export function cancel (req, res) {
  txStorage.del(req.params.txId)
  res.send(req.tx)
}

export function proceed (req, res) {
  req.tx.execute()
  res.status(200).send()
}
