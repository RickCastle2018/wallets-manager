'use strict';

// TODO: Fuck. I can't live without Golang IDE support. MIGRATE TO TYPESCRIPT

// TODO: backup system
// TODO: logging, find logger lib and implement

// Define express.js app
const express = require('express');
const app = express();
const port = 2311;

// TODO: Create better cross-module vars names
// Connect to Binance Chain
const {
  BncClient
} = require("@binance-chain/javascript-sdk");
const api = (process.env.BLOCKCHAIN_NET == "mainnet") ? " https://dex.binance.org/" : "https://testnet-dex.binance.org/";
const bnc = new BncClient(api);
bnc.chooseNetwork(process.env.BLOCKCHAIN_NET || "testnet")
bnc.initChain();

// Start mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://db:27017/wallets', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// If connected successfully, run API
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (db) => {
  // TODO: Create round-wallet if not present in DB
  // TODO: Set userWalletRefillWebhook longpoller

  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json())

  require('./api')(app, db);

  app.listen(port, () => {
    console.log(`wallets-manager running at http://localhost:${port}`);
  });
});