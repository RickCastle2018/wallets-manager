import {
  createUserWallet,
  loadUserWallet
} from '../wallets/methods.js';

export function create(req, res) => {
  createUserWallet(req.params.idInGame, (uW, data) => {
    if (uW == false) return res.send(data);
    res.send({
      address: uW.address
    });
  });
}

export function middleware(req, res, next) {
  loadUserWallet(req.params.idInGame, (uW) => {
    if (uW) {
      req.userWallet = uW;
      next();
    } else {
      return res.status(404).send('user-wallet not found');
    }
  });
}

export function get(req, res) => {
  req.userWallet.getBalance((b) => {
    res.send({
      address: req.userWallet.address,
      balance: b
    });
  });
}

export function withdraw(req, res) => {
  switch (req.body.currency) {
    case 'bnb':
      req.userWallet.withdrawBNB(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).send();
      });
      break;
    case 'oglc':
      req.userWallet.withdrawCoin(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).send();
      });
      break;
    default:
      res.status(500).send('no currency provided');
  }
}
