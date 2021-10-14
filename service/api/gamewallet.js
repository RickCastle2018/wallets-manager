import {
	load as loadGameWallet
} from '../wallets/gamewallet.js';

// game-wallets

export function middleware(req, res, next) {
	loadGameWallet((gW) => {
		req.gameWallet = gW;
		next();
	});
}

export function get(req, res) {
	req.gameWallet.getBalance((b) => {
		res.send({
			address: req.gameWallet.address,
			balance: b,
		});
	});
}

export function withdraw(req, res) {
	switch (req.body.currency) {
	case 'bnb':
		req.gameWallet.withdrawBNB(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
			if (err) return res.status(500).send(err.message);
			return res.status(200).send();
		});
		break;
	case 'oglc':
		req.gameWallet.withdrawCoin(req.body.transaction_id, req.body.amount, req.body.to, (err) => {
			if (err) return res.status(500).send(err.message);
			return res.status(200).send();
		});
		break;
	default:
		res.status(500).send('no currency provided');
	}
}

export function buy(req, res) {
	switch (req.body.currency) {
	case 'bnb':
		req.gameWallet.buyWithBNB(req.body.transaction_id, req.body.amount, req.body.from, (err) => {
			if (err) return res.status(500).send(err.message);
			return res.status(200).send();
		});
		break;
	case 'oglc':
		req.gameWallet.buyWithCoin(req.body.transaction_id, req.body.amount, req.body.from, (err) => {
			if (err) return res.status(500).send(err.message);
			return res.status(200).send();
		});
		break;
	default:
		res.status(500).send('no currency provided');
	}
}
