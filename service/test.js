// the main integration test

const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.post('/wallets-manager', (req, res) => {
    console.log(req.body);
});

app.listen(80, async () => {
  // game-wallet creation & balance returning
  try {
    const res = await axios({
        method: 'get',
        url: 'http://127.0.0.1:2311/game-wallet'
    });
    if (res.data.balance.bnb == 0) return console.error('To run API tests you should put 1 BNB to game-wallet!\n' + res.data.address + ' --> ' + 'https://testnet.binance.org/faucet-smart');
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data);
  }
  // user-wallet creation
  try {
    const res = await axios({
        method: 'put',
        url: 'http://127.0.0.1:2311/user-wallets/1'
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data);
  }

  // user-wallet balance getting
  try {
    const res = await axios({
        method: 'get',
        url: 'http://127.0.0.1:2311/user-wallets/1'
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data);
  }

  // game-wallet withdraw
  try {
    const res = await axios({
        method: 'post',
        url: 'http://127.0.0.1:2311/game-wallet/withdraw',
        data: {
          transaction_id: 1,
          amount: '1159998899998000',
          to: 1, // idInGame
          currency: 'bnb' // oglc or bnb
        }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data);
  }

  // user-wallet withdraw
  try {
    const res = await axios({
        method: 'post',
        url: 'http://127.0.0.1:2311/user-wallets/1/withdraw',
        data: {
          transaction_id: 2,
          amount: '900000000',
          to: '0xFFAC005A8f7EC4e9943b2C8e7991C72f5cec4fD1', // idInGame
          currency: 'bnb' // oglc or bnb
        }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data);
  }

  try {
    const res = await axios({
        method: 'post',
        url: 'http://127.0.0.1:2311/user-wallets/1/withdraw',
        data: {
          transaction_id: 2,
          amount: '1115999889999800',
          to: '0xFFAC005A8f7EC4e9943b2C8e7991C72f5cec4fD1', // idInGame
          currency: 'oglc' // oglc or bnb
        }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data);
  }

});
