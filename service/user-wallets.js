// user-wallets.js is kinda Model (in the MVC paradigm)

// TODO: Write comments

const {
    Decimal128
} = require("mongodb");

// TODO: implement transaction history (approve transaction data)
// const transactionSchema = new mongoose.Schema({
//     // …
// });

const userWalletSchema = new mongoose.Schema({
    createdDate: Date,
    idInGame: Number,
    bnbAddress: String,
    privateKey: String,
    balance: Decimal128,
    // transactionHistory: [transactionSchema]
});

userWalletSchema.methods.withdraw = function (bnc, amount, recipient) {
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

// TODO: _construct method?
// userWalletSchema.methods.createDocument(mongoose) = function() {
//     // …
// }

const userWalletModel = mongoose.model('userWallet', userWalletSchema);

module.exports = {
    userWallet: userWalletModel,
    listenUserWalletsRefills: function () {
        // This is the most complicated thing in the project
        // https://docs.binance.org/api-reference/dex-api/ws-connection.html

        // I need to subscribe to an transfer updates in every wallet. WSCONNECTIONS = user-wallets count
        // and this function should be running in child process continously
    }
}