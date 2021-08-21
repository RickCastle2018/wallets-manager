// api.js is kinda Controller merged with View because it's API (in the MVC paradigm)

module.exports = function (app, db) {

    app.use('/', (res) => {
        res.redirect(301, 'https://github.com/Seasteading/wallets-manager')
    });

};