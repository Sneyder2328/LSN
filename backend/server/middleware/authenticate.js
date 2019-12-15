const {User} = require('../database/models/User');
const {Token} = require('../database/models/Token');
const {verifyJWT} = require('.././helpers/JWTHelper');
const jwt = require('jsonwebtoken');
const AUTH_ACCESS_TOKEN = 'authorization-access-token';
const AUTH_REFRESH_TOKEN = 'authorization-refresh-token';

const authenticate = (req, res, next) => {
    const accessToken = req.header(AUTH_ACCESS_TOKEN); // need to satinize
    try {
        const decodedPayload = verifyJWT(accessToken);
        console.log("decodedPayload=", decodedPayload);
        req.userId = decodedPayload.id;
        next();
    } catch (e) {
        const isTokenExpiredError = e instanceof jwt.TokenExpiredError;
        console.log(isTokenExpiredError);
        console.log("error=", e);
        res.status(401).send({status: isTokenExpiredError ? "Access token expired" : "Access token not valid"});
    }
};


module.exports = {authenticate, AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN};