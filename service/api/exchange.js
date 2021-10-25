export function get (req, res) {
  res.send({
    bnbPrice: process.env.BNB_PRICE,
    exchangeFee: process.env.EXCHANGE_FEE
  })
}

export function make (req, res) {
  if (!req.body.currency) res.status(500).send('no currency provided')

  req.userWallet.exchangeBNB(req.body.transaction_id, req.body.amount, false, (err, data) => {
    if (err) return res.status(500).send(err.message)
    return res.send(data)
  })
}
