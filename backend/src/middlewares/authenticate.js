const {User} = require('../database/models/User');
const {Token} = require('../database/models/Token');
const {config} = require('../config/config');
const {verifyJWT} = require('.././helpers/JWTHelper');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const accessToken = req.header(config.headers.accessToken); // need to satinize
    try {
        const decodedPayload = await verifyJWT(accessToken);
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