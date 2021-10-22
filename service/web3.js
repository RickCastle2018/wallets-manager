import Web3 from 'web3';

const web3 = new Web3(process.env.BLOCKCHAIN_NODE);
export default web3;

export function transferBNB(from, to, amount, transaction, callback) {
	web3.eth.getTransactionCount(from.address, (err, txCount) => {
		web3.eth.getGasPrice().then((gasPrice) => {
			const measureTx = {
				from: from.address,
				nonce: web3.utils.toHex(txCount),
				to: to.address,
				value: web3.utils.toHex(amount),
				chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
				gasPrice: web3.utils.toHex(gasPrice),
			};

			web3.eth.estimateGas(measureTx).then((estimateGas) => {
				const txObject = {
					from: from.address,
					nonce: web3.utils.toHex(txCount+transaction.id),
					to: to.address,
					value: web3.utils.toHex(amount),
					chain: web3.utils.toHex(process.env.BLOCKCHAIN_ID),
					gasPrice: web3.utils.toHex(gasPrice),
					gasLimit: web3.utils.toHex(Math.round(estimateGas + (estimateGas * 0.2))),
				};

				callback();

				if (!transaction.dry) {
					const tx = ethertx.Transaction.fromTxData(txObject, {
						common,
					});
					const privateKey = Buffer.from(from.privateKey.slice(2), 'hex');
					const signedTx = tx.sign(privateKey);

					const serializedTrans = signedTx.serialize();
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
			},
			(err) => {
				callback(err);
			});
		});
	});
}
