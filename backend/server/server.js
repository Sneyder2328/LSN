require("./config/config.js");
const express = require('express');
const {User} = require('./database/models/User');

const app = express();
const port = process.env.PORT;


app.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        console.log("Users:", JSON.stringify(users));
        res.send(JSON.stringify(users))
    } catch (e) {
        console.log("this just crashed!");
        res.status(400).send(e);
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};