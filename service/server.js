'use strict';

// TODO: Mongoose
// TODO: javascript-sdk

const express = require('express');
const app = express();
const port = 2311;

const db = {
  url: 'mongodb://db:27017/wallets'
}
const mongo = require('mongodb').MongoClient;
mongo.connect(db.url, (err, database) => {
  if (err) return console.log(err);

  require('./api')(app, database);

  app.listen(port, () => {
    console.log(`wallets-manager running at http://localhost:${port}`);
  });
})