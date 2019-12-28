const express = require('express');
const bodyParser = require('body-parser');
const router = require('../src/routes/index');
const cors = require("cors");
const corsOptions = require('../src/middlewares/cors');

const app = express();
const port = process.env.PORT || 3030;

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
/*
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, authorization, authorization-refresh-token, X-Requested-With, Accept');
    next()
});*/
app.use(bodyParser.json());
app.use('/', router);


const server = app.listen(port, () => {
    console.log(`Started on port  ${port}`);
});

module.exports = {app,server};