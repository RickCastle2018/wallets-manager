// api.js is kinda Controller and mb some kind of View (in the MVC paradigm)

module.exports = function(app, db) {

    app.use('/', (res) => {
      res.redirect(301, 'https://github.com/Seasteading/wallets-manager')
    });



};