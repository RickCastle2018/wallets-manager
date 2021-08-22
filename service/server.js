'use strict';

// TODO: Update dependences in BC javascript-sdk (dependabot)
// TODO: Move to faster framework https://habr.com/ru/post/434962/ (restify?)
// TODO: I can't live without Golang IDE support. MIGRATE TO TYPESCRIPT
// TODO: backup system (encrypt data?)
// TODO: logging, find logger lib and implement
// TODO: Unit tests for user-wallets.js & round-wallet.js

// Define express.js app
const express = require('express');
const app = express();
const port = 2311;

// Start mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://db:27017/wallets', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// If connected successfully, run API
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {

  // Connect to Binance Chain
  const {
    BncClient
  } = require("@binance-chain/javascript-sdk");
  const api = (process.env.BLOCKCHAIN_NET == "mainnet") ? " https://dex.binance.org/" : "https://testnet-dex.binance.org/";
  const bnc = new BncClient(api);
  bnc.chooseNetwork(process.env.BLOCKCHAIN_NET)
  bnc.initChain();

  // init roundWallet
  const rW = require('./round-wallet');
  const roundWallet = rW.load(bnc, rW.Model);

  // TODO: run listenUserWalletsRefills

  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json())

  app.use('/', (req, res) => {
    res.redirect(301, 'https://github.com/Seasteading/wallets-manager')
  });

  require('./api')(app, db, roundWallet);

  app.listen(port, () => {
    console.log(`wallets-manager running at http://localhost:${port}`);
  });
});