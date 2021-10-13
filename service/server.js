'use strict';

import mongoose from 'mongoose';
import express from 'express';
import walletmethods from './src/walletmethods.js';

// TODO: refactor: promises and async/await, optimize code repeating in handles

// Start mongoose connection
const dbName = process.env.DB_NAME;
mongoose.connect('mongodb://127.0.0.1:27017/' + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// If connected successfully, run API
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {

  // Define express.js app
  const app = express();

  // Setup Refills Listening
  // listenRefills();

  // Auto JSON responces parsing&marshalling
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());

  // user-wallets
  app.put('/user-wallets/:idInGame', (req, res) => {
    walletmethods.createUserWallet(req.params.idInGame, (uW, data) => {
      if (uW == false) return res.send(data);
      res.send({
        address: uW.address
      });
    });
  });
  app.use('/user-wallets/:idInGame*', function (req, res, next) {
    walletmethods.loadUserWallet(req.params.idInGame, (uW) => {
      if (uW) {
        req.userWallet = uW;
        next();
      } else {
        return res.status(404).send('user-wallet not found');
      }
    });
  });
  app.get('/user-wallets/:idInGame', (req, res) => {
    req.userWallet.getBalance((b) => {
      res.send({
        address: req.userWallet.address,
        balance: b
      });
    });
  });
  app.post('/user-wallets/:idInGame/withdraw', (req, res) => {
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
  });
  // Exchange Handles
  app.get('/user-wallets/:idInGame/exchange', (req, res) => {
    res.send({
      bnbPrice: process.env.BNB_PRICE,
      fee: process.env.EXCHANGE_FEE
    });
  });
  // TODO: Remove repeated code
  app.post('/user-wallets/:idInGame/exchange/dry', (req, res) => {
    switch (req.body.currency) {
      case 'oglc':
        req.userWallet.exchangeCoin(req.body.transaction_id, req.body.amount, true, (err, data) => {
          if (err) return res.status(500).send(err.message);
          res.send(data);
        });
        break;
      case 'bnb':
        req.userWallet.exchangeBNB(req.body.transaction_id, req.body.amount, true, (err, data) => {
          if (err) return res.status(500).send(err.message);
          res.send(data);
        });
        break;
      default:
        res.status(500).send('no currency provided');
    }
  });
  app.post('/user-wallets/:idInGame/exchange', (req, res) => {
    switch (req.body.currency) {
      case 'oglc':
        req.userWallet.exchangeCoin(req.body.transaction_id, req.body.amount, false, (err, data) => {
          if (err) return res.status(500).send(err.message);
          res.send(data);
        });
        break;
      case 'bnb':
        req.userWallet.exchangeBNB(req.body.transaction_id, req.body.amount, false, (err, data) => {
          if (err) return res.status(500).send(err.message);
          res.send(data);
        });
        break;
      default:
        res.status(500).send('no currency provided');
    }
  });

  // game-wallet
  app.use('/game-wallet*', (req, res, next) => {
    walletmethods.loadGameWallet((gW) => {
      req.gameWallet = gW;
      next();
    });
  });
  app.get('/game-wallet', (req, res) => {
    req.gameWallet.getBalance((b) => {
      res.send({
        address: req.gameWallet.address,
        balance: b
      });
    });
  });
  app.post('/game-wallet/withdraw', (req, res) => {
    switch (req.body.currency) {
      case 'bnb':
        req.gameWallet.withdrawBNB(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
          if (err) return res.status(500).send(err.message);
          res.status(200).send();
        });
        break;
      case 'oglc':
        req.gameWallet.withdrawCoin(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
          if (err) return res.status(500).send(err.message);
          res.status(200).send();
        });
        break;
      default:
        res.status(500).send('no currency provided');
    }
  });
  app.post('/game-wallet/buy', (req, res) => {
    switch (req.body.currency) {
      case 'bnb':
        req.gameWallet.buyWithBNB(req.body.transaction_id, req.body.amount, req.body.from, (err) => {
          if (err) return res.status(500).send(err.message);
          res.status(200).send();
        });
        break;
      case 'oglc':
        req.gameWallet.buyWithCoin(req.body.transaction_id, req.body.amount, req.body.from, (err) => {
          if (err) return res.status(500).send(err.message);
          res.status(200).send();
        });
        break;
      default:
        res.status(500).send('no currency provided');
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`wallets-manager running at http://127.0.0.1:${process.env.PORT}`);
  });
});
