'use strict';

// TODO: docker-compose networking

// Tiny logger
var log_file_err = fs.createWriteStream(__dirname + '/error.log', {
  flags: 'a'
});
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
  log_file_err.write(util.format('Caught exception: ' + err) + '\n');
});

// Define express.js app
const express = require('express');
const app = express();
const port = 2311;

// Connect to Binance Chain
const {
  BncClient
} = require("@binance-chain/javascript-sdk");
const api = (process.env.BLOCKCHAIN_NET == "mainnet") ? " https://dex.binance.org/" : "https://testnet-dex.binance.org/";
const client = new BncClient(api);
client.initChain();

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
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json())

  require('./api')(app, db);

  app.listen(port, () => {
    console.log(`wallets-manager running at http://localhost:${port}`);
  });
});