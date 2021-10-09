// TODO: AUTOMATIZE

const axios = require('axios');

axios({
        method: 'post',
        url: 'http://localhost:2311/user-wallets/1/exchange',
        data: {
            transaction_id: 0,
            currency: 'oglc', // bnb/oglc (what to exchange)
            amount: 10 * (10 ** 18)
        }
    }).then((res) => {
        console.log(res.data);
    })
    .catch((err) => console.log(err.data))
    .then(() => {

        axios({
                method: 'post',
                url: 'http://localhost:2311/user-wallets/1/exchange',
                data: {
                    transaction_id: 0,
                    currency: 'bnb', // bnb/oglc (what to exchange)
                    amount: 0.1 * (10 ** 18)
                }
            }).then((res) => {
                console.log(res.data);
            })
            .catch((err) => console.log(err.data));

    });