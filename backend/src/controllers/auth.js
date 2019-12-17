const {Router} = require('express');
const {signUpUser, logInUser, logOutUser, genNewAccessToken} = require('../services/auth');
const {config} = require('../config/config');
const endpoints = require('../utils/constants/endpoints');
const {signUpValidationRules, logInValidationRules, refreshTokenValidationRules, validate} = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');

const router = Router();

router.post(endpoints.auth.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {accessToken, refreshToken} = await signUpUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true});
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {accessToken, refreshToken} = await logInUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true});
}));


router.get(endpoints.auth.REFRESH_TOKEN, refreshTokenValidationRules, validate, handleErrorAsync(async (req, res) => {
    const refreshToken = req.header(config.headers.refreshToken);
    const accessToken = await genNewAccessToken(refreshToken);
    res.header(config.headers.accessToken, accessToken)
        .send({status: 'New access token issued'});
}));

router.post(endpoints.auth.LOG_OUT, refreshTokenValidationRules, validate, handleErrorAsync(async (req, res) => {
    const refreshToken = req.header(config.headers.refreshToken);
    const loggedOut = await logOutUser(refreshToken);
    res.send({loggedOut})
}));

module.exports = router;