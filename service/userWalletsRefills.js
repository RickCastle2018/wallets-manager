// This is sub-service, that sends Webhook to game when user-wallet refunded

// Parse Args
const blockchainNet = process.argv[0];

// Connect to Mongo
const mongo = require('mongodb').MongoClient;
mongo.connect('mongodb://db:27017/wallets', (err, db) => {
    if (err) return console.log(err);
    
    // Get all wallets
    const collection = db.collection('userWallet');
    collection.find({}, (err, userWallets) => {
        if (err) return console.log(err);

        userWallets.forEach(uW => {
            
        });
    });


});

    // Subscribe to their updates

// Check in cycle if new wallets in DB and check their updates