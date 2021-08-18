// TODO: .gitignore ignore db

'use strict';

const express = require('express');
const app = express();
const port = 2311;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`wallets-manager running at http://localhost:${port}`)
})
