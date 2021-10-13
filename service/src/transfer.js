import Transaction from '@ethereumjs/tx';
import Common from '@ethereumjs/common';
import axios from 'axios';
import web3 from './web3.js';
import coin from './coin.js';

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

function transferCoin(from, to, amount, transaction, callback) { // from is userWalletModel or gameWalletModel

  web3.eth.getTransactionCount(from.address, (err, txCount) => {

    web3.eth.getGasPrice().then((gasPrice) => {

      let data = coin.methods.transfer(to.address, new web3.utils.BN(amount)).encodeABI();

      let txObject = {
        "from": from.address,
        "nonce": web3.utils.toHex(txCount),
        "to": process.env.COIN_CONTRACT,
        "data": data,
        "value": web3.utils.toHex(0),
        "gasPrice": web3.utils.toHex(gasPrice),
        "chain": web3.utils.toHex(process.env.BLOCKCHAIN_ID),
        "gasLimit": web3.utils.toHex(100000)
      };

      coin.methods.transfer(to.address, new web3.utils.BN(amount)).estimateGas(txObject, (err) => {
        // txObject.gasLimit = web3.utils.toHex(estimateGas);
        if (err) return callback(err);
        callback();

        if (!transaction.dry) {
          const tx = new Transaction(txObject, {
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

            const tx = new Transaction(txObject, {
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

export default {transferCoin, transferBNB}
