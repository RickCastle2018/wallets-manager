// user-wallets.js is kinda Model (in the MVC paradigm)

const { Decimal128 } = require("mongodb");

// TODO: Rewrite as object
module.exports = function (mongoose, db) {

    // TODO: implement transaction history (approve transaction data)
    // const transactionSchema = new mongoose.Schema({
    //     // …
    // });

    const userWalletSchema = new mongoose.Schema({
        id: mongoose.ObjectId,
        gameId: Number,
        createdDate: Date,
        bnbAddress: String, 
        balance: Decimal128,
        privateKey: String,
        // transactionHistory: [transactionSchema]
    });

    // Schema methods

    const userWallet = mongoose.model('userWallet', userWalletSchema);

}