// This is sub-service, that sends Webhooks to game

// TODO: Redis

// Some helper functions
// function subscribe

// Parse Args
const blockchainNet = process.argv[2];
const api = (blockchainNet == "mainnet") ? "wss://dex.binance.org/api/ws" : "wss://testnet-dex.binance.org/api/ws";

const webhookListener = process.argv[3];

// Connect to Mongo
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://db:27017/wallets', (err, db) => {
    if (err) return console.log(err);

    // TODO: load from backup and check all transactions after wake up
    // TODO: ONLY REFILL IS SUPPORTED! t.hash (support other webhook types)
    let transactionsList = [];
    process.on('message', function (t) {
        transactionsList.push(t.hash);
    });

    // Get all wallets
    // BUG: TypeError: db.collection is not a function
    const collection = db.collection('userwallets');
    collection.find({}, (err, userWallets) => {
        if (err) return console.log(err);

        const {
            WebSocket
        } = require('ws');
        const conn = new WebSocket(api);
        conn.on('open', function (evt) {
            console.log(evt.stream);

            userWallets.forEach(uW => {
                conn.send(JSON.stringify({
                    method: "subscribe",
                    topic: "transfers",
                    address: uW.address
                }));
            });

            // TODO: Check in cycle if new wallets in DB and check their updates
        });
        const axios = require('axios');
        conn.on('message', function (evt) {
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
        conn.onerror = function (evt) {
            console.error('an error occurred', evt.data);
        };
        setInterval(() => {
            // This will extend the connection time to another 30 minutes
            // It's good to send this message every 30 minutes to maintain the connection life
            conn.send(JSON.stringify({
                method: "keepAlive"
            }));
        }, 1500000); // 25 min

    });


});