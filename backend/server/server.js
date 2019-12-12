require("./config/config.js");
const {connection}  = require("./database/database");
const express = require('express');

const app = express();
const port = process.env.PORT;

connection.connect((err) => {
    if(err) throw err;
    console.log("Connected!");
});


app.get('/', (req, res) => {
    res.send("Hello DB");
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};