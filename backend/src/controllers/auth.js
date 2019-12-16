const {Router} = require('express');
const {signUpUser, logInUser, genNewAccessToken} = require('../services/auth');
const {config} = require('../config/config');

const router = Router();

router.post('/signUp', async (req, res) => {
    const user = req.body; // validate, if not valid throw some validation error
    const {accessToken, refreshToken} = await signUpUser(user);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true});
});

router.post('/logIn', async (req, res) => {
    const user = req.body; //needs satinize
    const {accessToken, refreshToken} = await logInUser(user);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true});
});


router.get('/refreshToken', async (req, res) => {
    const refreshToken = req.header(config.headers.refreshToken); // need to satinize
    const accessToken = await genNewAccessToken(refreshToken);
    res.header(config.headers.accessToken, accessToken).send({status: 'New access token issued'});
    //console.log(e);
    //res.status(401).send({status: 'Error generating new access token'});
});


module.exports = router;