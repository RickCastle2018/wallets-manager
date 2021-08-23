// round-wallet.js is kinda Model (in the MVC paradigm)

const mongoose = require('mongoose');

const {
    Decimal128
} = require("mongodb");

const roundWalletSchema = new mongoose.Schema({
    asset: String,
    address: String,
    privateKey: String,
    balance: Decimal128
});

roundWalletSchema.methods.withdraw = function (bnc, amount, recipientGameId) {
    const asset = "BNB";
    bnc.setPrivateKey(this.privateKey);

    // !!! USER ID
    bnc.transfer(this.bnbAddress, recipient, amount, asset).then(
        (res) => {
            if (res.status === 200) {
                return true;
            } else {
                return res.body.text;
            }
        }
    );
}

roundWalletSchema.methods.getBalance = function (bnc) {

}

roundWalletSchema.methods.deposit = function (bnc, amount, depositor) {

}

const RoundWallet = mongoose.model('RoundWallet', roundWalletSchema);

// TODO: Maybe update round wallet (change address & transfer money) function

module.exports = {
    Model: RoundWallet,
    load: function (bnc, model) {

        const roundWallets = model.find(function (err, roundWallets) {
            if (err) return console.error(err);
            return roundWallets;
        });

        if (roundWallets.length < 1) {
            const account = bnc.createAccount();
            const rW = new model({
                asset: 'bnb',
                address: account.address,
                privateKey: account.privateKey,
                balance: 0
            });
            rW.save(function (err, rW) {
                if (err) return console.error(err);
            });
            return rW;
        } else {
            const rW = roundWallets[0];
            return rW;
        }

    }
}