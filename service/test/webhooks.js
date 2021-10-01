const express = require('express');
const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.post("/wallets-manager", (req, res) => {
    res.send(req.body);
    console.log(req.body);
});

app.listen(80, () => {
    console.log(`Listening for webhooks from wallets-manager`);
});