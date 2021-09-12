'use strict';

// TODO: Write backuper.sh
// TODO: MAKEFILE!! 2 docker-composes and make up-dev

const {
  Common
} = require('ethereumjs-common');
const Tx = require('ethereumjs-tx').Transaction;
const {
  fork
} = require('child_process');
const Web3 = require('web3');
const axios = require('axios');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');

// Start WebhookMaster
const args = [process.env.BLOCKCHAIN_NET, process.env.WEBHOOK_LISTENER];
const rl = fork('WebhookMaster.js', args);
rl.on('close', (code) => {
  console.log('Webhook Master Exited with code ' + code);
});

// Connect to Binance Smart Chain and coins' smart contract
const api = (process.env.BLOCKCHAIN_NET == 'mainnet') ? 'https://bsc-dataseed.binance.org:443' : 'https://data-seed-prebsc-1-s1.binance.org:8545';
const web3 = new Web3(api);

// FIXME: !!! SIMPLETOKEN CHANGE
const abi = fs.readFileSync('./coin/simpletoken-abi.json', 'utf8');
const contract = web3.eth.Contract(abi);
const oglc = contract.at(process.env.COIN_CONTRACT);

// Setup Transactions Sender
const blockchainId = (process.env.BLOCKCHAIN_NET == 'mainnet') ? 56 : 97;
const common = Common.forCustomChain('mainnet', {
  networkId: blockchainId,
  chainId: blockchainId
}, 'petersburg');

function transfer(from, to, amount, transactionId) { // from is userWalletModel or gameWalletModel

  const txObject = {
    from: from.address,
    to: to,
    value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
  };

  const tx = new Tx(txObject, {
    common
  });
  tx.sign(from.privateKey);

  const serializedTrans = tx.serialize();
  const raw = '0x' + serializedTrans.toString('hex');

  web3.eth.sendSignedTransaction(raw).once('transactionHash', (hash) => {
    // tell Refills Listener to ignore this transaction, because it caused by Game
    rl.send(hash);
  }).on('confirmation', (confNumber, receipt, latestBlockHash) => {
    const webhook = {
      user_id: ('idInGame' in from) ? from.idInGame : loadUserId,
      type: string,
      transaction_id: int,
      status: 'success' / 'fail',
    };

    axios({
      method: 'post',
      url: process.env.WEBHOOK_LISTENER,
      data: webhook
    });
  });

}

// Define wallets models
// user-wallets
const userWalletSchema = new mongoose.Schema({
  createdDate: Date,
  idInGame: Number,
  address: String,
  privateKey: String,
  latestTransaction: String
});
userWalletSchema.methods.getBalance = function (callback) {
  bnc.getBalance(this.address).then((balances) => {
    if (balances.length < 1) {
      callback(0);
    } else {
      callback(balances.free);
    }
  }).catch(err => console.error(err));
};
userWalletSchema.methods.withdraw = function (gameTransactionId, amount, recipient, callback) {
  const eventType = 'withdraw';

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
    latestTransaction: ''
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
  asset: String,
  address: String,
  privateKey: String,
  latestTransaction: String
});
gameWalletSchema.methods.getBalance = function (callback) {
  bnc.getBalance(this.address).then((balances) => {
    if (balances.length < 1) {
      callback(0);
    } else {
      callback(balances.free);
    }
  }).catch(err => console.error(err));
};
gameWalletSchema.methods.withdraw = function (gameTransactionId, amount, recipientGameId, callback) {
  const eventType = 'exit';
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
gameWalletSchema.methods.deposit = function (gameTransactionId, amount, depositorGameId, callback) {
  const eventType = 'deposit';

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
const GameWallet = mongoose.model('GameWallet', gameWalletSchema);

function loadGameWallet(callback) {

  GameWallet.find({
    asset: asset
  }, function (err, gameWallets) {
    if (err) return console.error(err);

    if (gameWallets.length < 1) {
      const account = bnc.createAccount();
      const gW = new GameWallet({
        asset: asset,
        address: account.address,
        privateKey: account.privateKey,
        latestTransaction: '',
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