import { readFileSync } from 'fs';
import ethertx from '@ethereumjs/tx';
import Common from '@ethereumjs/common';
import axios from 'axios';
import web3 from '../web3.js';

const abi = JSON.parse(readFileSync('./coin/contracts/oglc.json', 'utf8'));
const coin = new web3.eth.Contract(abi, process.env.COIN_CONTRACT);
export default coin;

const common = Common.default.forCustomChain('mainnet', {
	name: 'bnb',
	networkId: process.env.BLOCKCHAIN_ID,
	chainId: process.env.BLOCKCHAIN_ID,
	chain: process.env.BLOCKCHAIN_ID,
}, 'petersburg');

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
					const tx = ethertx.Transaction.fromTxData(txObject, {
						common,
					});
					const privateKey = Buffer.from(from.privateKey.slice(2), 'hex');
					tx.sign(privateKey);

					const serializedTrans = tx.serialize();
					const raw = `0x${serializedTrans.toString('hex')}`;

					web3.eth.sendSignedTransaction(raw, (hash) => {
						// ignore this transaction, no webhook, because it caused by Game
						// requestedTransactions.push(hash);
					}).once('receipt', (receipt) => {
						transaction.user.getBalance((b) => {
							const webhook = {
								transaction_id: transaction.id,
								type: transaction.type,
								successful: receipt.status,
								gasPaid: receipt.gasUsed,
								user: {
									id: transaction.user.idInGame,
									balance: b,
									address: transaction.user.address,
								},
							};

							axios({
								method: 'post',
								url: process.env.WEBHOOKS_LISTENER,
								data: webhook,
							});
						});
					}).on('error', (error) => {
						const webhook = {
							transaction_id: transaction.id,
							type: transaction.type,
							successful: false,
							error: error.message,
						};

						axios({
							method: 'post',
							url: process.env.WEBHOOKS_LISTENER,
							data: webhook,
						});
					});
				}
			});
		});
	});
}
