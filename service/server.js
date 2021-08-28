'use strict';

// Maintainer: Nikita Nikonov @nikonovcc
// All the code is in the server.js without fucking modules. I couldn't manage with them. Plus I've written a whole callback-hell

// TODO: Migrate to TypeScript. Because codebase is growing and there's no fucking IDE support for me.
// TODO: Update dependences (fork) @binance-chain/javascrpt-sdk (merge dependabot)
// TODO: Use faster web framework https://habr.com/ru/post/434962/ (restify? - almost compatible with express.js)
// TODO: Write backup daemon! (.sh&CRON?)
// TODO: Logging debug (find logger lib and implement)

// Define express.js app
const express = require('express');
const app = express();
const port = 2311;

// Connect to Binance Chain
const {
  BncClient
} = require("@binance-chain/javascript-sdk");
const api = (process.env.BLOCKCHAIN_NET == "mainnet") ? " https://dex.binance.org/" : "https://testnet-dex.binance.org/";
const bnc = new BncClient(api);
bnc.chooseNetwork(process.env.BLOCKCHAIN_NET);
bnc.initChain();

// Define wallets models
const mongoose = require('mongoose');

// user-wallets
// TODO: implement transaction history (approve transaction data)
// const transactionSchema = new mongoose.Schema({
//     // …
// });
const userWalletSchema = new mongoose.Schema({
  createdDate: Date,
  idInGame: Number,
  address: String,
  privateKey: String,
  balance: mongoose.Decimal128,
  // transactionHistory: [transactionSchema]
});
userWalletSchema.methods.withdraw = function (amount, recipient, callback) {
  const asset = "BNB";
  bnc.setPrivateKey(this.privateKey);
  this.balance = this.balance - amount;
  this.save();
  bnc.transfer(this.bnbAddress, recipient, amount, asset).then(
    (res) => {
      if (res.status === 200) {
        callback(true);
      } else {
        callback(false);
      }
    }
  );
};
const UserWallet = mongoose.model('UserWallet', userWalletSchema);

function createUserWallet(userIdInGame, callback) {
  let account = bnc.createAccount();
  let userWallet = new UserWallet({
    createdDate: new Date(),
    idInGame: userIdInGame,
    address: account.address,
    privateKey: account.privateKey,
    balance: new mongoose.Types.Decimal128("0".toString())
  });
  userWallet.save().then(
    (uW) => {
      uW.created = true;
      callback(uW);
    }
  );
}

function loadUserWallet(userIdInGame, callback) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, function (err, uW) {
    if (err) return console.error(err);
    callback(uW);
  });
}

// round-wallet
const roundWalletSchema = new mongoose.Schema({
  asset: String,
  address: String,
  privateKey: String,
  balance: mongoose.Decimal128
});
roundWalletSchema.methods.withdraw = function (amount, recipientGameId) {
  const asset = "BNB";
  bnc.setPrivateKey(this.privateKey);

  const userWallet = loadUserWallet(recipientGameId);

  bnc.transfer(this.address, userWallet.address, amount, asset).then(
    (res) => {
      if (res.status === 200) {
        this.balance = this.balance - amount;
        this.save();
        userWallet.balance = userWallet.balance + amount - 0.000075;
        userWallet.save();
        return true;
      } else {
        return res.body.text;
      }
    }
  );
};
roundWalletSchema.methods.deposit = function (amount, depositorGameId) {
  const userWallet = loadUserWallet(depositorGameId);

  const asset = "BNB";
  bnc.setPrivateKey(userWallet.privateKey);

  bnc.transfer(userWallet.address, this.address, amount, asset).then(
    (res) => {
      if (res.status === 200) {
        this.balance = this.balance + amount - 0.000075; // BUG: DECIMAL128 calculations!
        this.save();
        userWallet.balance = userWallet.balance - amount;
        userWallet.save();
        return true;
      } else {
        return res.body.text;
      }
    }
  );
};
const RoundWallet = mongoose.model("RoundWallet", roundWalletSchema);

function loadRoundWallet(callback) {

  RoundWallet.find({
    asset: 'bnb'
  }, function (err, roundWallets) {
    if (err) return console.error(err);

    if (roundWallets.length < 1) {
      const account = bnc.createAccount();
      const rW = new RoundWallet({
        asset: 'bnb',
        address: account.address,
        privateKey: account.privateKey,
        balance: 0
      });
      console.log(rW);
      rW.save(function (err) {
        if (err) return console.error(err);
      });
      callback(rW);
    } else {
      const rW = roundWallets[0];
      callback(rW);
    }

  });

}

// Start mongoose connection
mongoose.connect('mongodb://db:27017/wallets', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// If connected successfully, run API
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {

  // Auto JSON responces parsing&marshalling
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());

  // user-wallets
  app.post('/user-wallets/:idInGame', (req, res) => {
    createUserWallet(req.idInGame, (uW) => {
      res.send({
        success: uW.created,
        blockchain_address: uW.address
      });
    });
  });
  app.param('idInGame', function (req, res, next) {
    loadUserWallet(req.IdInGame, (uW) => {
      if (uW != false) {
        req.userWallet = uW;
        next();
      } else {
        // eslint-disable-next-line no-undef
        next(createError(404, 'What the hell are you trying to use a non-existent user-wallet!?'));
      }
    });
  });
  app.get('/user-wallets/:idInGame', (req, res) => {
    res.send({
      blockchain_address: req.userWallet.address,
      balance: req.userWallet.balance
    });
  });
  app.post('/user-wallets/:idInGame/withdraw', (req, res) => {
    const success = req.userWallet.withdraw(req.body.amount, req.body.to);
    if (success == true) {
      res.send({
        successful: success
      });
    } else {
      res.send({
        successful: false,
        error: success
      });
    }
  });
  // app.get('/user-wallets/:idInGame/transactions', (req, res) => {
  // TODO: after beta
  // });

  // round-wallet
  app.use('/round-wallet*', (req, res, next) => {
    loadRoundWallet((rW) => {
      req.roundWallet = rW;
      next();
    });
  });
  app.get('/round-wallet', (req, res) => {
    res.send({
      address: req.roundWallet.address,
      balance: req.roundWallet.balance
    });
  });
  app.post('/round-wallet/withdraw', (req, res) => {
    const success = req.roundWallet.withdraw(req.body.amount, req.body.to);
    if (success == true) {
      res.send({
        successful: true,
        locked: req.body.amount
      });
    } else {
      res.send({
        successful: false,
        error: success
      });
    }
  });
  app.post('/round-wallet/deposit', (req, res) => {
    const success = req.roundWallet.deposit(req.body.amount, req.body.from);
    if (success == true) {
      res.send({
        success: true,
        locked: req.body.amount
      });
    } else {
      res.send({
        success: false,
        error: success
      });
    }
  });

  app.listen(port, () => {
    console.log(`wallets-manager running at http://127.0.0.1:${port}`);
  });
});

// TODO: listenUserWalletsRefills !!! corutine?