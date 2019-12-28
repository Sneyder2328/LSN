const express = require('express');
const bodyParser = require('body-parser');
const router = require('../src/routes/index');
const cors = require("cors");
const corsOptions = require('../src/middlewares/cors');

const app = express();
const port = process.env.PORT || 3030;

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', router);


const server = app.listen(port, () => {
    console.log(`Started on port  ${port}`);
});

module.exports = {app,server};