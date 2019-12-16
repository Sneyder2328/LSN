const {config} = require('../config/config');
const {verifyJWT} = require('.././helpers/JWTHelper');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const accessToken = req.header(config.headers.accessToken);
    console.log("accessToken here=", accessToken);
    if (!config.regex.jwt.test(accessToken))
        next(new AppError(401, 0, "Access token not valid"), req, res, next);
    try {
        const decodedPayload = await verifyJWT(accessToken);
        console.log("decodedPayload=", decodedPayload);
        req.userId = decodedPayload.id;
        next();
    } catch (e) {
        const isTokenExpiredError = e instanceof jwt.TokenExpiredError;
        console.log(isTokenExpiredError);
        console.log("error=", e);
        next(new AppError(401, 0, isTokenExpiredError ? "Access token expired" : "Access token not valid"), req, res, next);
    }
};