// round-wallet.js is kinda Model (in the MVC paradigm)

const roundWalletSchema = new mongoose.Schema({
    asset: String,
    address: String,
    privateKey: String,
    balance: Decimal128
});

roundWalletSchema.methods.withdraw = function (bnc, amount, recipient) {
    const asset = "BNB";
    bnc.setPrivateKey(this.privateKey);
    bnc.transfer(this.bnbAddress, recipient, amount, asset).then(
        (res) => {
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        }
    );
}

const roundWalletModel = mongoose.model('roundWallet', roundWalletSchema);

// TODO: Maybe update round wallet (change address & transfer money) function

module.exports = {
    roundWallet: roundWalletModel,
    loadRoundWallet: function (bnc, roundWalletModel) {

        // Check if there's no round wallet
        const account = bnc.createAccount();
        const rW = new roundWalletModel({
            asset: 'bnb',
            address: account.address,
            privateKey: account.privateKey,
            balance: 0
        });
        rW.save(function (err, rW) {
            if (err) return console.error(err);
        });

    }
}