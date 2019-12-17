const {config} = require('../config/config');
const AuthError = require('../utils/errors/AuthError');
const error = require('../utils/constants/errors');
const {verifyJWT} = require('.././helpers/JWTHelper');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const accessToken = req.header(config.headers.accessToken);
    if (!config.regex.jwt.test(accessToken))
        return next(new AuthError(error.message.ACCESS_TOKEN_INVALID), req, res, next);
    try {
        const decodedPayload = await verifyJWT(accessToken);
        req.userId = decodedPayload.id;
        next();
    } catch (e) {
        const isTokenExpiredError = e instanceof jwt.TokenExpiredError;
        return next(new AuthError(isTokenExpiredError ? error.message.ACCESS_TOKEN_EXPIRED : error.message.ACCESS_TOKEN_INVALID), req, res, next);
    }
};