'use strict';

// TODO: Write backuper.sh
// TODO: Store variables in separate gitignore .env file
// TODO: Logs to file

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

      const data = coin.methods.transfer(to.address, amount);

      const measureTx = {
        "from": from.address,
        "value": web3.utils.toHex(0),
        "gasPrice": web3.utils.toHex(gasPrice),
        "chain": web3.utils.toHex(process.env.BLOCKCHAIN_ID)
      };

      coin.methods.transfer(to.address, amount).estimateGas(measureTx, (err, estimateGas) => {
        
        if (err) return callback(err);

        const txObject = {
          "from": from.address,
          "nonce": web3.utils.toHex(txCount),
          "to": process.env.COIN_CONTRACT,
          "data": data,
          "value": web3.utils.toHex(0),
          "gasPrice": web3.utils.toHex(gasPrice),
          "chain": web3.utils.toHex(process.env.BLOCKCHAIN_ID),
          "gasLimit": web3.utils.toHex(100000) // web3.utils.toHex(new web3.utils.BN(Math.round(estimateGas + (estimateGas * 0.2))))
        };

        callback();
                
        if (!transaction.dry) {

          const tx = new Tx(txObject, {
            common
          });
          const privateKey = Buffer.from(from.privateKey.slice(2), 'hex');
          tx.sign(privateKey);

          const serializedTrans = tx.serialize();
          const raw = '0x' + serializedTrans.toString('hex');

          web3.eth.sendSignedTransaction(raw, (hash) => {
            // ignore this transaction, no webhook, because it caused by Game
            requestedTransactions.push(hash);
          }).once('receipt', (receipt) => {

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
        }

      });

    });
  });
}

function transferBNB(from, to, amount, transaction, callback) {
  web3.eth.getTransactionCount(from.address, (err, txCount) => {
    web3.eth.getGasPrice().then((gasPrice) => {

      const measureTx = {
        "from": from.address,
        "nonce": web3.utils.toHex(txCount),
        "to": to.address,
        "value": web3.utils.toHex(amount),
        "chain": web3.utils.toHex(process.env.BLOCKCHAIN_ID),
        "gasPrice": web3.utils.toHex(gasPrice)
      };

      web3.eth.estimateGas(measureTx).then((estimateGas) => {

          const txObject = {
            "from": from.address,
            "nonce": web3.utils.toHex(txCount),
            "to": to.address,
            "value": web3.utils.toHex(amount),
            "chain": web3.utils.toHex(process.env.BLOCKCHAIN_ID),
            "gasPrice": web3.utils.toHex(gasPrice),
            "gasLimit": web3.utils.toHex(Math.round(estimateGas + (estimateGas * 0.2)))
          };

          callback();

          if (!transaction.dry) {

            const tx = new Tx(txObject, {
              common
            });
            const privateKey = Buffer.from(from.privateKey.slice(2), 'hex');
            tx.sign(privateKey);

            const serializedTrans = tx.serialize();
            const raw = '0x' + serializedTrans.toString('hex');

            web3.eth.sendSignedTransaction(raw, (hash) => {
              // ignore this transaction, no webhook, because it caused by Game
              requestedTransactions.push(hash);
            }).once('receipt', (receipt) => {

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

          }

        },
        (err) => {
          callback(err);
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
  const user = {
    address: recipient
  };
  transferCoin(this, user, amount, {
    "id": gameTransactionId,
    "user": this,
    "type": 'withdraw',
    "dry": false
  }, (err) => {
    callback(err);
  });
};
userWalletSchema.methods.withdrawBNB = function (gameTransactionId, amount, recipient, callback) {
  const user = {
    address: recipient
  };
  transferBNB(this, user, amount, {
    "id": gameTransactionId,
    "user": this,
    "type": 'withdraw',
    "dry": false
  }, (err) => {
    callback(err);
  });
};
// TODO: calculate exchange/withdraw possibility functions (on/off flag in config)
userWalletSchema.methods.exchangeCoin = function (gameTransactionId, coins, dry, callback) {
  loadGameWallet((gW) => {

    const bigCoins = new BigNumber(coins);
    const bnb = bigCoins.dividedBy(process.env.BNB_PRICE).minus(bigCoins.multipliedBy(process.env.EXCHANGE_FEE));

    transferBNB(this, gW, bnb, {
      "id": gameTransactionId,
      "user": this,
      "type": "exchange",
      "dry": dry
    }, (err) => {
      if (!err) {
        transferCoin(gW, this, coins, {
          "id": gameTransactionId,
          "user": this,
          "type": 'exchange',
          "dry": dry
        }, (err) => {
          if (!err) {
            callback(undefined, {
              amount: bnb.toString(),
              fee: bigCoins.multipliedBy(process.env.EXCHANGE_FEE).toString()
            });
          } else {
            callback(err);
          }
        });
      } else {
        callback(err);
      }
    });

  });
};
userWalletSchema.methods.exchangeBNB = function (gameTransactionId, bnb, dry, callback) {
  loadGameWallet((gW) => {

    const bigBNB = new BigNumber(bnb);
    const coins = bigBNB.multipliedBy(process.env.BNB_PRICE).minus(bigBNB.multipliedBy(process.env.EXCHANGE_FEE));

    transferBNB(this, gW, bnb, {
      "id": gameTransactionId,
      "user": this,
      "type": "exchange",
      "dry": dry
    }, (err) => {
      if (!err) {
        transferCoin(gW, this, coins, {
          "id": gameTransactionId,
          "user": this,
          "type": 'exchange',
          "dry": dry
        }, (err) => {
          if (!err) {
            callback(undefined, {
              amount: coins,
              fee: bigBNB.multipliedBy(process.env.EXCHANGE_FEE).toString
            });
          } else {
            callback(err);
          }
        });
      } else {
        callback(err);
      }
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
gameWalletSchema.methods.withdrawCoin = function (gameTransactionId, amount, recipientGameId, callback) {
  loadUserWallet(recipientGameId, (uW) => {
    if (uW) {
      transferCoin(this, uW, amount, {
        "id": gameTransactionId,
        "user": {
          "idInGame": 0,
          "address": this.address
        },
        "type": "exit",
        "dry": false
      }, (err) => {
        callback(err);
      });
    } else {
      callback("recipient not provided");
    }
  });
};
gameWalletSchema.methods.withdrawBNB = function (gameTransactionId, amount, recipientGameId, callback) {
  loadUserWallet(recipientGameId, (uW) => {
    if (uW) {
      transferBNB(this, uW, amount, {
        "id": gameTransactionId,
        "user": {
          "idInGame": 0,
          "address": this.address
        },
        "type": "exit",
        "dry": false
      }, (err) => {
        callback(err);
      });
    } else {
      callback("recipient not provided");
    }
  });
};
gameWalletSchema.methods.buy = function (gameTransactionId, amount, depositorGameId, callback) {
  loadUserWallet(depositorGameId, (uW) => {
    if (uW) {
    transferCoin(uW, this, amount, {
      "id": gameTransactionId,
      "user": {
        "idInGame": 0,
        "address": this.address
      },
      "type": 'purchase',
      "dry": false
    }, (err) => {
      callback(err);
    });
    } else {
      callback("no recipient provided");
    }
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
  // TODO: Remove double
  app.post('/user-wallets/:idInGame/exchange/dry', (req, res) => {
    switch (req.body.currency) {
      case 'oglc':
        req.userWallet.exchangeCoin(req.body.transaction_id, req.body.amount, true, (err, data) => {
          if (err) return res.status(500).send(err);
          res.send(data);
        });
        break;
      case 'bnb':
        req.userWallet.exchangeBNB(req.body.transaction_id, req.body.amount, true, (err, data) => {
          if (err) return res.status(500).send(err);
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
          if (err) return res.status(500).send(err);
          res.send(data);
        });
        break;
      case 'bnb':
        req.userWallet.exchangeBNB(req.body.transaction_id, req.body.amount, false, (err, data) => {
          if (err) return res.status(500).send(err);
          res.send(data);
        });
        break;
      default:
        res.status(500).send('no currency provided');
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
    switch (req.body.currency) {
      case 'bnb':
        req.gameWallet.withdrawBNB(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
          if (err) return res.status(500).send(err);
          res.status(200).send();
        });
        break;
      case 'oglc':
        req.gameWallet.withdrawCoin(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
          if (err) return res.status(500).send(err);
          res.status(200).send();
        });
        break;
      default:
        res.status(500).send('no currency provided');
    }
  });
  app.post('/game-wallet/buy', (req, res) => {
    req.gameWallet.buy(req.body.transaction_id, req.body.amount, req.body.from, (err) => {
      if (!err) return res.status(500).send(err);
      res.status(200).send();
    });
  });

  app.listen(process.env.PORT, () => {
    console.log(`wallets-manager running at http://127.0.0.1:${process.env.PORT}`);
  });
});