'use strict';

// TODO: Write backuper.sh

const Tx = require('ethereumjs-tx').Transaction;
const Common = require('@ethereumjs/common');
const Web3 = require('web3');
const axios = require('axios');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const BigNumber = require('bignumber.js');

// Connect to Binance Smart Chain and coins' smart contract
const web3 = new Web3(process.env.BLOCKCHAIN_NODE);
const abi = JSON.parse(fs.readFileSync('./coin/oglc.json', 'utf8'));
const coin = new web3.eth.Contract(abi, process.env.COIN_CONTRACT);

const common = Common.default.forCustomChain('mainnet', {
  name: 'bnb',
  networkId: process.env.BLOCKCHAIN_ID,
  chainId: process.env.BLOCKCHAIN_ID
}, 'petersburg');

const defaultCommon = {
  customChain: {
    chainId: process.env.BLOCKCHAIN_ID,
    networkId: process.env.BLOCKCHAIN_ID
  },
  baseChain: 'mainnet',
  hardfork: 'petersburg'
};
web3.eth.defaultCommon = defaultCommon;
coin.defaultCommon = defaultCommon;

// TODO: Store in Redis with backups
let requestedTransactions = [];

// Transfer builders
function transferCoin(from, to, amount, transaction, callback) { // from is userWalletModel or gameWalletModel

  web3.eth.getTransactionCount(from.address, (err, txCount) => {

    web3.eth.getGasPrice().then((gasPrice) => {

      let data = coin.methods.transfer(to.address, amount.toString()).encodeABI();

      let txObject = {
        "from": from.address,
        "nonce": web3.utils.toHex(txCount),
        "to": process.env.COIN_CONTRACT,
        "data": data,
        "value": web3.utils.toHex(0),
        "gasPrice": web3.utils.toHex(gasPrice),
        "chain": web3.utils.toHex(process.env.BLOCKCHAIN_ID),
        "gasLimit": web3.utils.toHex(100000)
      };

      coin.methods.transfer(to.address, amount).estimateGas(txObject).then((estimateGas) => {
        // txObject.gasLimit = web3.utils.toHex(estimateGas);

        const tx = new Tx(txObject, {
          common
        });
        const privateKey = Buffer.from(from.privateKey.slice(2), 'hex');
        tx.sign(privateKey);

        const serializedTrans = tx.serialize();
        const raw = '0x' + serializedTrans.toString('hex');

        let event = web3.eth.sendSignedTransaction(raw, (hash) => {
          // ignore this transaction, no webhook, because it caused by Game
          requestedTransactions.push(hash);
        }).catch(err => {
          return callback(err);
        });
        callback();
        event.once('confirmation', (confNumber, receipt) => {
          transaction.user.getBalance((b) => {

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
              url: process.env.WEBHOOKS_LISTENER,
              data: webhook
            });
          });

        });

      });

    });

  });

}

function transferBNB(from, to, amount, transaction, callback) {
  web3.eth.getTransactionCount(from.address, (err, txCount) => {

    web3.eth.getGasPrice().then((gasPrice) => {

      let txObject = {
        "from": from.address,
        "nonce": web3.utils.toHex(txCount),
        "to": to.address,
        "value": web3.utils.toHex(amount.toString()),
        "chain": web3.utils.toHex(process.env.BLOCKCHAIN_ID),
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": web3.utils.toHex(100000)
      };

      // TODO: gasLimit optimisation
      web3.eth.estimateGas(txObject).then((estimateGas) => {
        // txObject.gasLimit = web3.utils.toHex(estimateGas);

        const tx = new Tx(txObject, {
          common
        });
        const privateKey = Buffer.from(from.privateKey.slice(2), 'hex');
        tx.sign(privateKey);

        const serializedTrans = tx.serialize();
        const raw = '0x' + serializedTrans.toString('hex');

        let event = web3.eth.sendSignedTransaction(raw, (hash) => {
          // ignore this transaction, no webhook, because it caused by Game
          requestedTransactions.push(hash);
        }).catch(err => {
          return callback(err);
        });
        callback();
        event.once('confirmation', (confNumber, receipt) => {

          transaction.user.getBalance((b) => {
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
              url: process.env.WEBHOOKS_LISTENER,
              data: webhook
            });
          });

        });

      });

    });

  });
}

function listenRefills() {
  // TODO: Setup own websockets node
  // TODO: Listen only for our user-wallets
  let options = {
    filter: {
      value: [],
    },
    fromBlock: 0
  };
  coin.events.Transfer(options)
    .on('data', (t) => {

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
              url: process.env.WEBHOOKS_LISTENER,
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
userWalletSchema.methods.withdrawCoin = function (gameTransactionId, amount, recipient, callback) {
  transferCoin(this, recipient, amount, {
    "id": gameTransactionId,
    "user": {
      "idInGame": 0,
      "address": this.address
    },
    "type": 'withdraw'
  }, (err) => {
    callback(err);
  });
};
userWalletSchema.methods.withdrawBNB = function (gameTransactionId, amount, recipient, callback) {
  transferBNB(this, recipient, amount, {
    "id": gameTransactionId,
    "user": this,
    "type": 'withdraw'
  }, (err) => {
    callback(err);
  });
};
// TODO: calculate exchange/withdraw possibility functions (on/off flag in config)
userWalletSchema.methods.exchangeCoin = function (gameTransactionId, coins, callback) {
  loadGameWallet((gW) => {

    const bigCoins = new BigNumber(coins);
    const bnb = bigCoins.dividedBy(process.env.BNB_PRICE).minus(bigCoins.multipliedBy(process.env.EXCHANGE_COMMISSION));

    this.getBalance((uwBalance) => {
      gW.getBalance((gwBalance) => {

        if (uwBalance.oglc < coins || gwBalance.bnb < bnb.toString()) {
          callback('insufficient funds');
        } else {

          transferBNB(this, gW, bnb, {
            "id": gameTransactionId,
            "user": this,
            "type": "exchange"
          }, (err) => {
            callback(err);

            if (!err) {
              transferCoin(gW, this, coins, {
                "id": gameTransactionId,
                "user": this,
                "type": 'exchange'
              }, (err) => {
                callback(err);
              });
            }
          });

        }

      });
    });

  });
};
userWalletSchema.methods.exchangeBNB = function (gameTransactionId, bnb, callback) {
  loadGameWallet((gW) => {

    const bigBNB = new BigNumber(bnb);
    const coins = bigBNB.multipliedBy(process.env.BNB_PRICE).minus(bigBNB.multipliedBy(process.env.EXCHANGE_COMMISSION));

    this.getBalance((uwBalance) => {
      gW.getBalance((gwBalance) => {

        if (uwBalance.bnb < bnb || gwBalance.oglc < coins.toString()) {
          callback('insufficient funds');
        } else {

          transferBNB(this, gW, bnb, {
            "id": gameTransactionId,
            "user": this,
            "type": "exchange"
          }, (err) => {
            callback(err);

            if (!err) {
              transferCoin(gW, this, coins, {
                "id": gameTransactionId,
                "user": this,
                "type": 'exchange'
              }, (err) => {
                callback(err);
              });
            }
          });

        }

      });
    });

  });
};
const UserWallet = mongoose.model('UserWallet', userWalletSchema);

function createUserWallet(userIdInGame, callback) {

  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err, foundWallet) => {

    if (err) {
      callback(foundWallet);
    } else {

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

  });
}

function loadUserWallet(userIdInGame, callback) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err, uW) => {
    if (err) return console.error(err);
    callback(uW);
  });
}

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
    transferCoin(this, uW, amount, {
      "id": gameTransactionId,
      "user": this,
      "type": "exit"
    });
  });
};
gameWalletSchema.methods.deposit = function (gameTransactionId, amount, depositorGameId) {
  loadUserWallet(depositorGameId, (uW) => {
    transferCoin(uW, this, amount, {
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
const dbName = process.env.DB_NAME;
mongoose.connect('mongodb://db:27017/' + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define express.js app
const app = express();

// If connected successfully, run API
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {

  // Setup Refills Listening
  listenRefills();

  // Auto JSON responces parsing&marshalling
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());

  // user-wallets
  app.put('/user-wallets/:idInGame', (req, res) => {
    createUserWallet(req.params.idInGame, (uW) => {
      res.send({
        address: uW.address
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
        address: req.userWallet.address,
        balance: b
      });
    });
  });
  app.post('/user-wallets/:idInGame/withdraw', (req, res) => {
    switch (req.body.currency) {
      case 'bnb':
        req.userWallet.withdrawBNB(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
          if (err) return res.status(500).send(err);
          res.status(200).send();
        });
        break;
      case 'oglc':
        req.userWallet.withdrawCoin(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
          if (err) return res.status(500).send(err);
          res.status(200).send();
        });
        break;
    }
  });
  // Exchange Handles
  app.get('/user-wallets/:idInGame/exchange', (req, res) => {
    res.send({
      bnb: process.env.BNB_PRICE,
      commission: process.env.EXCHANGE_COMMISSION
    });
  });
  app.post('/user-wallets/:idInGame/exchange', (req, res) => {
    switch (req.body.exchange) {
      case 'oglc':
        req.userWallet.exchangeCoin(req.body.transaction_id, req.body.amount, (err) => {
          if (err != undefined) return res.status(500).send(err);
          res.status(200).send();
        });
        break;
      case 'bnb':
        req.userWallet.exchangeBNB(req.body.transaction_id, req.body.amount, (err) => {
          if (err != undefined) return res.status(500).send(err);
          res.status(200).send();
        });
        break;
    }
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
    try {
      req.gameWallet.withdraw(req.body.transaction_id, req.body.amount, req.body.to);
      res.status(200).send();
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.post('/game-wallet/deposit', (req, res) => {
    try {
      req.gameWallet.deposit(req.body.transaction_id, req.body.amount, req.body.from);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`wallets-manager running at http://127.0.0.1:${port}`);
  });
});