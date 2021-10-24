export function get (req, res) {
  res.send({
    bnbPrice: process.env.BNB_PRICE,
    fee: process.env.EXCHANGE_FEE
  })
}

export function calculate (req, res) {
  switch (req.body.currency) {
    case 'oglc':
      req.userWallet.exchangeCoin(req.body.transaction_id, req.body.amount, true, (err, data) => {
        if (err) return res.status(500).send(err.message)
        return res.send(data)
      })
      break
    case 'bnb':
      req.userWallet.exchangeBNB(req.body.transaction_id, req.body.amount, true, (err, data) => {
        if (err) return res.status(500).send(err.message)
        return res.send(data)
      })
      break
    default:
      res.status(500).send('no currency provided')
  }
}

export function make (req, res) {
  switch (req.body.currency) {
    case 'oglc':
      req.userWallet.exchangeCoin(req.body.transaction_id, req.body.amount, false, (err, data) => {
        if (err) return res.status(500).send(err.message)
        return res.send(data)
      })
      break
    case 'bnb':
      req.userWallet.exchangeBNB(req.body.transaction_id, req.body.amount, false, (err, data) => {
        if (err) return res.status(500).send(err.message)
        return res.send(data)
      })
      break
    default:
      res.status(500).send('no currency provided')
  }
}
