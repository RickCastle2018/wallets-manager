// This is sub-service, that sends Webhooks to game

// TODO: Redis

// Some helper functions
// function subscribe

// Parse Args
const blockchainNet = process.argv[0];
const api = (blockchainNet == "mainnet") ? "wss://dex.binance.org/api/" : "wss://testnet-dex.binance.org/api/";

// Connect to Mongo
const mongo = require('mongodb').MongoClient;
mongo.connect('mongodb://db:27017/wallets', (err, db) => {
    if (err) return console.log(err);

    // Connect to Websocket API

    // This will extend the connection time to another 30 minutes
    // It's good to send this message every 30 minutes to maintain the connection life
    conn.send(JSON.stringify({
        method: "keepAlive"
    }));

    // Get all wallets
    const collection = db.collection('userWallet');
    collection.find({}, (err, userWallets) => {
        if (err) return console.log(err);

        userWallets.forEach(uW => {

        });
    });


});


// Check in cycle if new wallets in DB and check their updates

// Subscription types:
// Requested by main service (and the game)
// Refill all users