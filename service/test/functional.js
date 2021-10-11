// testing all of the functional, if returns true to console - service can be pushed to prod
// before running - start service with testnet, go to BSC testnet faucet (https://testnet.binance.org/faucet-smart) and request 1BNB for game-wallet (get address: curl 127.0.0.1/game-wallet)

const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.post('/wallets-manager', (req, res) => {
    res.send(req.body);
    console.log(req.body);
});

app.listen(80, () => {
  axios({
      method: 'post',
      url: 'http://127.0.0.1:2311/user-wallets/1/withdraw',
      data: {
          transaction_id: 0,
          currency: 'oglc', // bnb/oglc (what to exchange)
          amount: 10 * (10 ** 18)
      }
  }).then((res) => {
      console.log(res.data);
  })
  .catch((err) => console.log(err.data))
});
