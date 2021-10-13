import mongoose from 'mongoose';
import coin from './coin.js';
import web3 from './web3.js';
import transfer from './transfer.js';
import walletmethods from './walletmethods.js';

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
  transfer.transferCoin(this, user, amount, {
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
  transfer.transferBNB(this, user, amount, {
    "id": gameTransactionId,
    "user": this,
    "type": 'withdraw',
    "dry": false
  }, (err) => {
    callback(err);
  });
};
userWalletSchema.methods.calculateExchange = function (amount, currencyFrom, callback) {
  return callback('not implemented');

  // loadGameWallet((gW) => {
  //
  //   if (currencyFrom == 'bnb') {
  //     const bnb = bigCoins.divn(parseInt(process.env.BNB_PRICE)); //.neg(bigCoins.divn(100).muln(parseInt(process.env.EXCHANGE_FEE)))
  //   } else {
  //     const coins = bigBNB.mul(process.env.BNB_PRICE).neg(bigBNB.mul(process.env.EXCHANGE_FEE));
  //   }
  //
  //   callback();
  //
  //   transferBNB(this, gW, bnb, {
  //     "id": gameTransactionId,
  //     "user": this,
  //     "type": "exchange",
  //     "dry": true
  //   }, (err) => {
  //     if (!err) {
  //       transferCoin(gW, this, coins, {
  //         id: gameTransactionId,
  //         user: this,
  //         type: 'exchange',
  //         dry: true
  //       }, (err) => {
  //         if (!err) {
  //           callback(undefined, {
  //             amount: bnb.toString(),
  //             fee: bigCoins.divn(100).muln(parseInt(process.env.EXCHANGE_FEE)).toString()
  //           });
  //         } else {
  //           callback(err);
  //         }
  //       });
  //     } else {
  //       callback(err);
  //     }
  //   });
  //
  // });

}
userWalletSchema.methods.exchange = function (transaction, callback) {
  walletmethods.loadGameWallet((gW) => {

    let sender = {};
    if (transaction.currency == 'bnb') {
      sender.bnb = this;
      sender.oglc = gW;
    } else {
      sender.bnb = gW;
      sender.oglc = this;
    }

    transfer.transferBNB(sender.bnb, sender.oglc, transaction.bnb, {
      id: transaction.id,
      user: this,
      type: 'exchange',
      dry: false
    }, (err) => {
      callback(err);
    });

    transfer.transferCoin(sender.oglc, sender.bnb, transaction.oglc, {
      id: transaction.id,
      user: this,
      type: 'exchange',
      dry: false
    }, (err) => {
      callback(err);
    });

    callback();

  });
};
const UserWallet = mongoose.model('UserWallet', userWalletSchema);

export default UserWallet;
