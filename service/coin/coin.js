import { readFileSync } from 'fs';
import web3 from '../web3.js';

const abi = JSON.parse(readFileSync('./coin/contracts/oglc.json', 'utf8'));
const coin = new web3.eth.Contract(abi, process.env.COIN_CONTRACT);
export default coin;

export function transfer(from, to, amount, transaction, callback) { // userWallet or gameWallet
	web3.eth.getTransactionCount(from.address, (err, txCount) => {
		web3.eth.getGasPrice().then((gasPrice) => {
			const data = coin.methods.transfer(to.address, new web3.utils.BN(amount)).encodeABI();

			const txObject = {
				from: from.address,
				nonce: web3.utils.toHex(txCount),
				to: process.env.COIN_CONTRACT,
				data,
				value: web3.utils.toHex(0),
				gasPrice: web3.utils.toHex(gasPrice),
				chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
				gasLimit: web3.utils.toHex(100000),
			};

			coin.methods.transfer(to.address, new web3.utils.BN(amount)).estimateGas(txObject, (err) => {
				// txObject.gasLimit = web3.utils.toHex(estimateGas);
				if (err) return callback(err);
				callback();

				if (!transaction.dry) {

				}
			});
		});
	});
}
