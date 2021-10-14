import mongoose from 'mongoose';
import express from 'express';

import * as uw from './api/userwallets.js';
import * as gw from './api/gamewallet.js';
import * as exchange from './api/exchange.js';

// TODO: refactor: promises and async/await, optimize code repeating in handles

// TODO: Logging
// const winston = require('winston');
// const expressWinston = require('express-winston');

// app.use(expressWinston.errorLogger({
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({
//       name: 'access-file',
//       filename: 'error.log',
//       level: 'info'
//     })
//   ],
//   format: winston.format.combine(
//     winston.format.colorize(),
//     winston.format.json()
//   )
// }));

// Start mongoose connection
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// If connected successfully, run API
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
	// Start Refills Listening
	// listenRefills();

	// Define express.js app
	const app = express();

	// Auto JSON responces parsing&marshalling
	app.use(express.urlencoded({
		extended: true,
	}));
	app.use(express.json());

	// game-wallet
	app.use('/game-wallet*', gw.middleware);
	app.get('/game-wallet', gw.get);
	app.post('/game-wallet/withdraw', gw.withdraw);
	app.post('/game-wallet/buy', gw.buy);

	// user-wallets
	app.put('/user-wallets/:idInGame', uw.create);
	app.use('/user-wallets/:idInGame*', uw.middleware);
	app.get('/user-wallets/:idInGame', uw.get);
	app.post('/user-wallets/:idInGame/withdraw', uw.withdraw);

	// exchange
	app.get('/exchange', exchange.get);
	app.post('/exchange/calculate', exchange.calculate);
	app.post('/user-wallets/:idInGame/exchange', exchange.make);

	// nfts

	app.listen(process.env.PORT, () => {
		console.log(`wallets-manager running at http://127.0.0.1:${process.env.PORT}`);
	});
});
