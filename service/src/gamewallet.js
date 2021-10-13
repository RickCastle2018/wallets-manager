import mongoose from 'mongoose';
import web3 from './web3.js';
import coin from './coin.js';
import walletmethods from './walletmethods.js'
import transfer from './transfer.js'

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
      transfer.transferCoin(this, uW, amount, {
        id: gameTransactionId,
        user: this,
        type: "exit",
        dry: false
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
      transfer.transferBNB(this, uW, amount, {
        id: gameTransactionId,
        user: this,
        type: 'exit',
        dry: false
      }, (err) => {
        callback(err);
      });
    } else {
      callback("recipient not provided");
    }
  });
};
gameWalletSchema.methods.buyWithCoin = function (gameTransactionId, amount, depositorGameId, callback) {
  loadUserWallet(depositorGameId, (uW) => {
    if (uW) {
      transfer.transferCoin(uW, this, amount, {
        id: gameTransactionId,
        user: this,
        type: 'purchase',
        dry: false
      }, (err) => {
        callback(err);
      });
    } else {
      callback("no recipient provided");
    }
  });
};
gameWalletSchema.methods.buyWithBNB = function (gameTransactionId, amount, depositorGameId, callback) {
  loadUserWallet(depositorGameId, (uW) => {
    if (uW) {
      transfer.transferBNB(uW, this, amount, {
        id: gameTransactionId,
        user: this,
        type: 'purchase',
        dry: false
      }, (err) => {
        callback(err);
      });
    } else {
      callback("no recipient provided");
    }
  });
};
const GameWallet = mongoose.model('GameWallet', gameWalletSchema);

export default GameWallet
