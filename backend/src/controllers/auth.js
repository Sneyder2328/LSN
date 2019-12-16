const {Router} = require('express');
const {signUpUser, logInUser, genNewAccessToken} = require('../services/auth');
const {config} = require('../config/config');
const {signUpValidationRules, logInValidationRules, refreshTokenValidationRules, validate} = require('../middlewares/validate');

const router = Router();

router.post('/signUp', signUpValidationRules, validate, async (req, res) => {
    const {accessToken, refreshToken} = await signUpUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true});
});

router.post('/logIn', logInValidationRules, validate, async (req, res) => {
    const {accessToken, refreshToken} = await logInUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true});
});


router.get('/refreshToken', async (req, res) => {
    const refreshToken = req.header(config.headers.refreshToken);
    const accessToken = await genNewAccessToken(refreshToken);
    res.header(config.headers.accessToken, accessToken).send({status: 'New access token issued'});
    //console.log(e);
    //res.status(401).send({status: 'Error generating new access token'});
});


module.exports = router;