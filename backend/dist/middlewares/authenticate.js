"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { config } = require('../config/config');
const AuthError = require('../utils/errors/AuthError');
const error = require('../utils/constants/errors');
const { verifyJWT } = require('.././helpers/JWTHelper');
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.header(config.headers.accessToken);
    if (!config.regex.jwt.test(accessToken))
        return next(new AuthError('accessToken', error.message.ACCESS_TOKEN_INVALID), req, res, next);
    try {
        const decodedPayload = yield verifyJWT(accessToken);
        req.userId = decodedPayload.id;
        next();
    }
    catch (e) {
        const isTokenExpiredError = e instanceof jwt.TokenExpiredError;
        return next(new AuthError('accessToken', isTokenExpiredError ? error.message.ACCESS_TOKEN_EXPIRED : error.message.ACCESS_TOKEN_INVALID), req, res, next);
    }
});
