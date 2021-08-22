// api.js is kinda Controller merged with View because it's API (in the MVC paradigm)

module.exports = function (app, db, roundWallet) {

    // round-wallet
    app.get('/round-wallet', (req, res) => {
        // Return balance and address
        
    });
    app.post('/round-wallet/withdraw', (req, res) => {
        // 
    });
    app.post('/round-wallet/deposit', (req, res) => {

    });

    // user-wallet
    app.param('idInGame', function (req, res, next, id) {
        // LOAD user!
        if (req.user = users[id]) {
            next();
        } else {
            next(createError(404, 'failed to find user'));
        }
    });
    app.get('/user-wallets/:idInGame', (req, res) => {

    });
    app.post('/user-wallets/:idInGame', (req, res) => {

    });
    // app.get('/user-wallets/:idInGame/transactions', (req, res) => {
    // TODO: after beta
    // });
    app.post('/user-wallets/:idInGame/withdraw', (req, res) => {

    });

};