'use strict';

// TODO: Migrate to TypeScript. Because codebase is growing and there's not enough fucking IDE support for me.
// TODO: Update dependences (fork) @binance-chain/javascrpt-sdk (merge dependabot)
// TODO: Use faster web framework https://habr.com/ru/post/434962/ (restify? - almost compatible with express.js)
// TODO: Write backup daemon! (.sh&CRON?)
// TODO: Logging, debug (find logger lib and implement)
// TODO: Devide user-wallets model and round-wallet model in modules (and their methods, such as loadRoundWallet)
// TODO: Write unit testss
// TODO: Redis to store queue of requests to wallets-manager

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
const asset = "BNB";

// Start WebhookMaster
const {
  fork
} = require('child_process');
const args = [process.env.BLOCKCHAIN_NET, process.env.WEBHOOK_LISTENER];
const wm = fork('WebhookMaster.js', args);
function monitorTransaction(userId, transactionId, transactionHash, transactionType) { // to pass the transaction to the WebhookMaster
  // worth it to load user-wallet?
  wm.send({
    userId: userId,
    hash: transactionHash,
    id: transactionId,
    type: transactionType
  });
}

// Define wallets models
const mongoose = require('mongoose');

// user-wallets
const userWalletSchema = new mongoose.Schema({
  createdDate: Date,
  idInGame: Number,
  address: String,
  privateKey: String,
  latestTransaction: String
});
userWalletSchema.methods.getBalance = function (userIdInGame, callback) {
  loadUserWallet(userIdInGame, (uW) => {
    let balances = bnc.getBalance(uW.address);
    callback(balances.free);
  });
};
userWalletSchema.methods.withdraw = function (gameTransactionId, amount, recipient, callback) {
  const eventType = "withdraw";

  bnc.setPrivateKey(this.privateKey);
  bnc.transfer(this.bnbAddress, recipient, amount, asset).then(
    (res) => {
      if (res.status !== 200) {
        callback(res.body.text);
      } else {
        const blockchainTransactionHash = res.result[0].hash;
        monitorTransaction(this.idInGame, gameTransactionId, blockchainTransactionHash, eventType);
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
    latestTransaction: ""
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
  latestTransaction: String
});
roundWalletSchema.methods.getBalance = function (callback) {
  loadRoundWallet((rW) => {
    let balances = bnc.getBalance(rW.address);
    callback(balances.free);
  });
};
roundWalletSchema.methods.withdraw = function (gameTransactionId, amount, recipientGameId, callback) {
  const eventType = "exit";
  bnc.setPrivateKey(this.privateKey);

  loadUserWallet(recipientGameId, (uW) => {
    bnc.transfer(this.address, uW.address, amount, asset).then(
      (res) => {
        if (res.status !== 200) {
          callback(res.body.text);
        } else {
          const blockchainTransactionHash = res.result[0].hash;
          monitorTransaction(uW.idInGame, gameTransactionId, blockchainTransactionHash, eventType);
        }
      }
    );
  });
};
roundWalletSchema.methods.deposit = function (gameTransactionId, amount, depositorGameId, callback) {
  const eventType = "deposit";

  loadUserWallet(depositorGameId, (uW) => {
    bnc.setPrivateKey(uW.privateKey);

    bnc.transfer(uW.address, this.address, amount, asset).then(
      (res) => {
        if (res.status !== 200) {
          callback(res.body.text);
        } else {
          const blockchainTransactionHash = res.result[0].hash;
          monitorTransaction(uW.idInGame, gameTransactionId, blockchainTransactionHash, eventType);
        }
      }
    );
  });
};
const RoundWallet = mongoose.model("RoundWallet", roundWalletSchema);

function loadRoundWallet(callback) {

  RoundWallet.find({
    asset: asset
  }, function (err, roundWallets) {
    if (err) return console.error(err);

    if (roundWallets.length < 1) {
      const account = bnc.createAccount();
      const rW = new RoundWallet({
        asset: asset,
        address: account.address,
        privateKey: account.privateKey,
        latestTransaction: "",
      });
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
  app.put('/user-wallets/:idInGame', (req, res) => {
    createUserWallet(req.idInGame, (uW) => {
      res.send({
        blockchain_address: uW.address
      });
    });
  });
  // BUG: the same user returned always
  app.param('idInGame', function (req, res, next) {
    loadUserWallet(req.IdInGame, (uW) => {
      if (uW) {
        req.userWallet = uW;
        next();
      } else {
        res.status(404).send();
      }
    });
  });
  app.get('/user-wallets/:idInGame', (req, res) => {
    req.userWallet.getBalance((b) => {
      res.send({
        blockchain_address: req.userWallet.address,
        balance: b
      });
    });
  });
  app.post('/user-wallets/:idInGame/withdraw', (req, res) => {
    req.userWallet.withdraw(req.body.amount, req.body.to, (err) => {
      if (err == undefined) return res.status(500).send(err);
      res.status(200).send();
    });
  });

  // round-wallet
  app.use('/round-wallet*', (req, res, next) => {
    loadRoundWallet((rW) => {
      req.roundWallet = rW;
      next();
    });
  });
  app.get('/round-wallet', (req, res) => {
    req.roundWallet.getBalance((b) => {
      res.send({
        address: req.roundWallet.address,
        balance: b
      });
    });
  });
  app.post('/round-wallet/withdraw', (req, res) => {
    req.roundWallet.withdraw(req.body.amount, req.body.to, (err) => {
      if (err == undefined) return res.status(500).send(err);
      res.status(200).send();
    });
  });
  app.post('/round-wallet/deposit', (req, res) => {
    req.roundWallet.deposit(req.body.amount, req.body.from, (err) => {
      if (err == undefined) return res.status(500).send(err);
      res.status(200).send();
    });
  });

  app.listen(port, () => {
    console.log(`wallets-manager running at http://127.0.0.1:${port}`);
  });
});