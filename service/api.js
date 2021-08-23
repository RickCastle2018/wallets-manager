// api.js is kinda Controller merged with View because it's API (in the MVC paradigm)

uW = require("./user-wallets");

module.exports = function (bnc, roundWallet) {

    // round-wallet
    app.get('/round-wallet', (req, res) => {
        res.send({
            address: roundWallet.address,
            balance: roundWallet.balance
        });
    });
    app.post('/round-wallet/withdraw', (req, res) => {
        const success = roundWallet.withdraw(bnc, req.body.amount, req.body.to);
        if (success == true) {
            res.send({
                successful: true,
                locked: req.body.amount
            });
        } else {
            res.send({
                successful: false,
                error: success
            });
        }
    });
    app.post('/round-wallet/deposit', (req, res) => {
        const success = roundWallet.deposit(bnc, req.body.amount, req.body.from);
        if (success == true) {
            res.send({
                success: true,
                locked: req.body.amount
            });
        } else {
            res.send({
                success: false,
                error: success
            });
        }
    });

    // user-wallets
    app.param('idInGame', function (req, res, next) {
        userWallet = uW.loadByIdInGame(uW.Model, req.IdInGame);
        if (user.found == true) {
            req.userWallet = userWallet;
            next();
        } else {
            next(createError(404, 'What the hell are you trying to use a non-existent user-wallet!?'));
        }
    });
    app.get('/user-wallets/:idInGame', (req, res) => {
        res.send({
            blockchain_address: req.userWallet.address,
            balance: req.userWallet.balance
        });
    });
    app.post('/user-wallets/:idInGame', (req, res) => {
        const user = uW.createNew(userId);
        if (user.created == true) {
            res.send({
                success: user.created,
                blockchain_address: user.address
            });
        } else {
            res.send({
                success: user.created,
                error: "Fuck. Call @nikonovcc immediately!"
            });
        }
    });
    app.post('/user-wallets/:idInGame/withdraw', (req, res) => {
        const success = req.userWallet.withdraw(bnc, req.body.amount, req.body.to);
        if (success == true) {
            res.send({
                successful: success
            });
        } else {
            res.send({
                successful: false,
                error: success
            });
        }
    });
    // app.get('/user-wallets/:idInGame/transactions', (req, res) => {
    // TODO: after beta
    // });

};