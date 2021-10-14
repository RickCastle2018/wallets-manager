// import axios from 'axios';
// import walletmethods from './walletmethods.js';
// // coin web3 airntfts
//
// // TODO: Store in Redis with backups
// const requestedTransactions = [];
//
// function listenRefills() {
//   // TODO: Listen only for our user-wallets
//   const options = {
//     filter: {
//       value: [],
//     },
//     fromBlock: 0,
//   };
//   coin.events.Transfer(options)
//     .on('data', (t) => {
//       loadUserWalletId(t.returnValues.to, (found, userWalletId) => {
//         coin.methods.balanceOf(t.returnValues.to, (err, b) => {
//           const webhook = {
//             transaction_id: 0,
//             type: 'refill',
//             successful: true,
//             user: {
//               id: userWalletId,
//               balance: b,
//             },
//           };
//
//           if (!requestedTransactions.includes(t.transactionHash) && found) {
//             axios({
//               method: 'post',
//               url: process.env.WEBHOOKS_LISTENER,
//               data: webhook,
//             });
//           }
//
//           const txli = requestedTransactions.indexOf(t.H);
//           if (txli != -1) {
//             requestedTransactions.split(txli, 1);
//           }
//         });
//       });
//     })
//     .on('error', (err) => {
//       console.error(err);
//     });
// }
//
// export default { requestedTransactions, listenRefills };
