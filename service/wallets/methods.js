import UserWallet from './userwallets.js';
import GameWallet from './gamewallet.js';
import web3 from '../web3.js';

// user-wallets
export function createUserWallet(userIdInGame, callback) {

  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err) => {

    if (err) {
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

    } else {
      callback(false, 'already exists');
    }

  });
}
export function loadUserWallet(userIdInGame, callback) {
  UserWallet.findOne({
    idInGame: userIdInGame
  }, (err, uW) => {
    if (err) return callback(false);
    callback(uW);
  });
}
export function loadUserWalletId(address, callback) {
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

// game-wallets

export function loadGameWallet(callback) {

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
