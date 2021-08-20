module.exports = function(app, db) {

    app.use('/', (res) => {
      res.redirect(301, 'https://github.com/Seasteading/wallets-manager')
    });

    

};