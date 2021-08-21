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
    userWallet: userWalletModel
}