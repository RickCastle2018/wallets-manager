import NodeCache from 'node-cache';
import ethertx from '@ethereumjs/tx';
import axios from 'axios';
import Common from '@ethereumjs/common';
import web3 from '../web3.js';
import {requestedTransactions} from './refills.js';

export const txStorage = new NodeCache({
	stdTTL: 300,
	checkperiod: 150,
});

export default class Tx {
  static common = Common.default.forCustomChain('mainnet', {
  	name: 'bnb',
  	networkId: process.env.BLOCKCHAIN_ID,
  	chainId: process.env.BLOCKCHAIN_ID,
  	chain: process.env.BLOCKCHAIN_ID,
  }, 'petersburg');

	constructor(txId, privateKey, txObject) {
		this.id = txId;

		const tx = ethertx.Transaction.fromTxData(txObject, {
			common,
		});
		const pK = Buffer.from(privateKey.slice(2), 'hex');
		tx.sign(pK);
		const serializedTrans = tx.serialize();
		this.raw = `0x${serializedTrans.toString('hex')}`;

		txStorage.set(txId, this);
	}

	cancel() {
		txStorage.del(this.id);
	}

	execute() {
		web3.eth.sendSignedTransaction(this.raw, (hash) => {
			requestedTransactions.set(hash, this.item);
		}).once('receipt', (receipt) => {
			web3.eth.getTransaction(receipt.transactionHash).then((tx) => {
				const webhook = {
					transaction_id: this.id,
					type: 'internal',
					successful: receipt.status,
					gasPaid: receipt.gasUsed,
					from: '', // tx.from
					to: '', // tx.to
				};

				axios({
					method: 'post',
					url: process.env.WEBHOOKS_LISTENER,
					data: webhook,
				});
			});
		}).on('error', (error) => {
			const webhook = {
				transaction_id: this.id,
				type: 'internal',
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
}
