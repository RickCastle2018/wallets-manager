db.createUser(
    {
        user: "ogle",
        pwd: "nikita",
        roles: [
            {
                role: "readWrite",
                db: "wallets-testnet"
            },
            {
                role: "readWrite",
                db: "wallets-mainnet"
            }
        ]
    }
);
