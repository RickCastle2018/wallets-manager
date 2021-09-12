// This is sub-service, that sends Webhooks to game

const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const Web3 = require('web3');

// Parse Args
const blockchainNet = process.argv[2];
const api = (blockchainNet == "mainnet") ? " https://bsc-dataseed.binance.org:443" : "https://data-seed-prebsc-1-s1.binance.org:8545";
const web3 = new Web3(api);

const webhookListener = process.argv[2];

// Connect to Mongo
MongoClient.connect('mongodb://db:27017/wallets', (err, db) => {
    if (err) return console.log(err);

    let ignoreTransactions = [];
    process.on('message', function (m) {
        transactionsList.push(m);
    });

    // Get all wallets
    // FIX: https://stackoverflow.com/a/47694265
    const collection = db.db().collection('userwallets');
    const cursor = collection.find();
    let userWallets = [];
    cursor.forEach((uW) => {
        userWallets.push(uW);
    });

    if (err) return console.log(err);

    let options = {
        fromBlock: 0,
        address: userWallets,    //Only get events from specific addresses
        topics: []                           //What topics to subscribe to
    };
    
    let subscription = web3.eth.subscribe('logs', options,(err,event) => {
        if (!err)
        console.log(event);
    });
    
    subscription.on('error', err => { throw err; });
    subscription.on('connected', nr => console.log(nr));
    
    subscription.on('data', function (evt) {
        let t = evt.data;

        function loadUserWalletId(address, callback) {
            collection.findOne({
                address: address
            }, (err, uW) => {
                let found;
                if (err) {
                    found = false;
                    uW = {
                        userIdInGame: ""
                    };
                }

                callback(found, uW.userIdInGame);
            });
        }

        // WHY t.t.o — see https://docs.binance.org/api-reference/dex-api/ws-streams.html#3-transfer
        loadUserWalletId(t.t.o, (found, userWalletId) => {
            const webhook = {
                user_id: userWalletId,
                type: "refill",
                amount: t.t.c.A
            };

            if (!transactionsList.includes(t.H) && found) {
                axios({
                    method: 'post',
                    url: webhookListener,
                    data: webhook
                });
            }

            let txli = transactionsList.indexOf(t.H);
            if (txli != -1) {
                transactionsList.split(txli, 1);
            }
        });
    });

});