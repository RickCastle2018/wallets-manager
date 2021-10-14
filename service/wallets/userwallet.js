import mongoose from 'mongoose';
import coin, { transfer as transferCoin } from '../coin/coin.js';
import web3, { transferBNB } from '../web3.js';
import { load as loadGameWallet } from './gamewallet.js';

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
		id: gameTransactionId,
		user: this,
		type: 'withdraw',
		dry: false
	}, (err) => {
		callback(err);
	});
};
userWalletSchema.methods.withdrawBNB = function (gameTransactionId, amount, recipient, callback) {
	const user = {
		address: recipient
	};
	transferBNB(this, user, amount, {
		id: gameTransactionId,
		user: this,
		type: 'withdraw',
		dry: false
	}, (err) => {
		callback(err);
	});
};
userWalletSchema.methods.calculateExchange = function (amount, currencyFrom, callback) {
	callback('not implemented');

// loadGameWallet((gW) => {
//
//   if (currencyFrom == 'bnb') {
//     const bnb = bigCoins.divn(parseInt(process.env.BNB_PRICE)); //.ne
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
};

userWalletSchema.methods.exchange = function (transaction, callback) {
	loadGameWallet((gW) => {
		const sender = {};
		if (transaction.currency === 'bnb') {
			sender.bnb = this;
			sender.oglc = gW;
		} else {
			sender.bnb = gW;
			sender.oglc = this;
		}

		transferBNB(sender.bnb, sender.oglc, transaction.bnb, {
			id: transaction.id,
			user: this,
			type: 'exchange',
			dry: false
		}, (err) => {
			callback(err);
		});

		transferCoin(sender.oglc, sender.bnb, transaction.oglc, {
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

export function create (userIdInGame, callback) {
	UserWallet.findOne({
		idInGame: userIdInGame
	}, (err) => {
		if (err) {
			const account = web3.eth.accounts.create();
			const userWallet = new UserWallet({
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

export function load (userIdInGame, callback) {
	UserWallet.findOne({
		idInGame: userIdInGame
	}, (err, uW) => {
		if (err) return callback(false);
		return callback(uW);
	});
}

export function loadId (address, callback) {
	UserWallet.findOne({
		address
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
