const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
    console.log(`Started on port  ${port}`);
});

module.exports = {app};