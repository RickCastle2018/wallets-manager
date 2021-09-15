'use strict';

// TODO: Write backuper.sh
// TODO: MAKEFILE! 2 docker-composes and `make up-dev` + docker-compose.dev.yml
// TODO: errors handling / passing

const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const axios = require('axios');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');

// Connect to Binance Smart Chain and coins' smart contract
const api = (process.env.BLOCKCHAIN_NET == 'mainnet') ? 'https://bsc-dataseed.binance.org:443' : 'https://data-seed-prebsc-1-s1.binance.org:8545';
const web3 = new Web3(api);

// FIXME: !!! SIMPLETOKEN CHANGE
const abi = JSON.parse(fs.readFileSync('./coin/simpletoken.json', 'utf8'));
const coin = new web3.eth.Contract(abi, process.env.COIN_CONTRACT);

// Setup Transactions Sender
const blockchainId = (process.env.BLOCKCHAIN_NET == 'mainnet') ? 56 : 97;

// TODO: Store in Redis with backups
let requestedTransactions = [];

function transfer(from, to, amount, transaction) { // from is userWalletModel or gameWalletModel

  web3.eth.getTransactionCount(from, (err, txCount) => {

    let data = coin.methods.transfer(to, amount).encodeABI();

    const txObject = {
      "nonce": web3.utils.toHex(txCount),
      "to": process.env.COIN_CONTRACT,
      "data": data,
      "value": web3.utils.toHex(0),
      "gasLimit": web3.utils.toHex(100000),
      "gasPrice": web3.utils.toHex(web3.utils.toWei(process.env.GAS_PRICE, 'gwei')),
      "chain": blockchainId
    };

    const tx = new Tx(txObject, {
      networkId: blockchainId,
      chainId: blockchainId,
      hardfork: "petersburg",
      chain: blockchainId
    });
    tx.sign(from.privateKey);

    const serializedTrans = tx.serialize();
    const raw = '0x' + serializedTrans.toString('hex');

    web3.eth.sendSignedTransaction(raw).once('transactionHash', (hash) => {
      // ignore this transaction, no webhook, because it caused by Game
      requestedTransactions.push(hash);
    }).on('confirmation', (confNumber, receipt) => {

      transaction.user.getBalance((err, b) => {
        const webhook = {
          "transaction_id": transaction.id,
          "type": transaction.type,
          "successful": receipt.status,
          "user": {
            "id": transaction.user.idInGame,
            "balance": b,
            "address": transaction.user.address
          }
        };

        axios({
          method: 'post',
          url: process.env.WEBHOOK_LISTENER,
          data: webhook
        });
      });

    });

  });

}

// Define wallets models
// user-wallets
const userWalletSchema = new mongoose.Schema({
  createdDate: Date,
  idInGame: Number,
  address: String,
  privateKey: String
});
userWalletSchema.methods.getBalance = function (callback) {
  coin.methods.balanceOf(this.address).call().then((coins) => {
    web3.eth.getBalance(this.address).then((bnb) => {
      callback({
        oglc: coins,
        bnb: bnb
      });
    });
  });
};
userWalletSchema.methods.withdraw = function (gameTransactionId, amount, recipient) {
  transfer(this, recipient, amount, {
    "id": gameTransactionId,
    "user": {
      "idInGame": 0,
      "address": this.address
    },
    "type": 'withdraw'
  });
};
userWalletSchema.methods.buy = function (price) {

};
const UserWallet = mongoose.model('UserWallet', userWalletSchema);

function createUserWallet(userIdInGame, callback) {
  let account = web3.eth.accounts.create();
  let userWallet = new UserWallet({
    createdDate: new Date(),
    idInGame: userIdInGame,
    address: account.address,
    privateKey: account.privateKey
  });
  userWallet.save().then(
    (uW) => {
      callback(uW);
    }
  );
}

function loadUserWallet(userIdInGame, callback) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err, uW) => {
    if (err) return console.error(err);
    callback(uW);
  });
}

// game-wallet
const gameWalletSchema = new mongoose.Schema({
  address: String,
  privateKey: String,
});
gameWalletSchema.methods.getBalance = function (callback) {
  coin.methods.balanceOf(this.address).call().then((coins) => {
    web3.eth.getBalance(this.address).then((bnb) => {
      callback({
        oglc: coins,
        bnb: bnb
      });
    });
  });
};
gameWalletSchema.methods.withdraw = function (gameTransactionId, amount, recipientGameId) {
  loadUserWallet(recipientGameId, (uW) => {
    transfer(this, uW, amount, {
      "id": gameTransactionId,
      "user": uW,
      "type": "exit"
    });
  });
};
gameWalletSchema.methods.deposit = function (gameTransactionId, amount, depositorGameId) {
  loadUserWallet(depositorGameId, (uW) => {
    transfer(uW, this, amount, {
      "id": gameTransactionId,
      "user": this,
      "type": 'deposit'
    });
  });
};
const GameWallet = mongoose.model('GameWallet', gameWalletSchema);

function loadGameWallet(callback) {

  GameWallet.find({}, function (err, gameWallets) {
    if (err) return console.error(err);

    if (gameWallets.length < 1) {
      const account = web3.eth.accounts.create();
      const gW = new GameWallet({
        address: account.address,
        privateKey: account.privateKey,
      });
      gW.save(function (err) {
        if (err) return console.error(err);
      });
      callback(gW);
    } else {
      const gW = gameWallets[0];
      callback(gW);
    }

  });

}

// Start mongoose connection
mongoose.connect('mongodb://db:27017/wallets', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define express.js app
const app = express();
const port = 2311;

// If connected successfully, run API
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {

  // Setup Refills Listening
  let options = {
    filter: {
      value: [],
    },
    fromBlock: 0
  };
  coin.events.Transfer(options)
    .on('data', (t) => {

      function loadUserWalletId(address, callback) {
        UserWallet.findOne({
          address: address
        }, (err, uW) => {
          let found;
          if (err) {
            found = false;
            uW = {
              userIdInGame: ''
            };
          }

          callback(found, uW.userIdInGame);
        });
      }

      loadUserWalletId(t.returnValues.to, (found, userWalletId) => {

        coin.methods.balanceOf(t.returnValues.to, (err, b) => {
          const webhook = {
            "transaction_id": 0,
            "type": 'refill',
            "successful": true,
            "user": {
              "id": userWalletId,
              "balance": b,
            }
          };

          if (!requestedTransactions.includes(t.transactionHash) && found) {
            axios({
              method: 'post',
              url: process.env.WEBHOOK_LISTENER,
              data: webhook
            });
          }

          let txli = requestedTransactions.indexOf(t.H);
          if (txli != -1) {
            requestedTransactions.split(txli, 1);
          }
        });

      });
    })
    .on('error', err => {
      console.error(err);
    });


  // Auto JSON responces parsing&marshalling
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());

  // user-wallets
  app.put('/user-wallets/:idInGame', (req, res) => {
    createUserWallet(req.params.idInGame, (uW) => {
      res.send({
        blockchain_address: uW.address
      });
    });
  });
  app.use('/user-wallets/:idInGame*', function (req, res, next) {
    loadUserWallet(req.params.idInGame, (uW) => {
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
        blockchain_address: req.userWallet.address,
        balance: b
      });
    });
  });
  app.post('/user-wallets/:idInGame/withdraw', (req, res) => {
    req.userWallet.withdraw(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
      if (err == undefined) return res.status(500).send(err);
      res.status(200).send();
    });
  });
  app.post('/user-wallets/:idInGame/buy', (req, res) => {
    req.userWallet.buy(req.body.price, (err) => {
      if (err == undefined) return res.status(500).send(err);
      res.status(200).send();
    });
  });

  // game-wallet
  app.use('/game-wallet*', (req, res, next) => {
    loadGameWallet((gW) => {
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
    req.gameWallet.withdraw(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
      if (err == undefined) return res.status(500).send(err);
      res.status(200).send();
    });
  });
  app.post('/game-wallet/deposit', (req, res) => {
    req.gameWallet.deposit(req.body.transaction_id, req.body.amount, req.body.from, (err) => {
      if (err == undefined) return res.status(500).send(err);
      res.status(200).send();
    });
  });

  app.listen(port, () => {
    console.log(`wallets-manager running at http://127.0.0.1:${port}`);
  });
});