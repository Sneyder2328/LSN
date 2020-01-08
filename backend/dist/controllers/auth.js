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
const { Router } = require('express');
const { signUpUser, logInUser, logOutUser, genNewAccessToken } = require('../services/auth');
const { config } = require('../config/config');
const endpoints = require('../utils/constants/endpoints');
const { signUpValidationRules, logInValidationRules, refreshTokenValidationRules, validate } = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const router = Router();
router.post(endpoints.auth.SIGN_UP, signUpValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = yield signUpUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({ access: true });
})));
router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = yield logInUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({ access: true });
})));
router.get(endpoints.auth.REFRESH_TOKEN, refreshTokenValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.header(config.headers.refreshToken);
    const accessToken = yield genNewAccessToken(refreshToken);
    res.header(config.headers.accessToken, accessToken)
        .send({ accessTokenIssued: true });
})));
router.delete(endpoints.auth.LOG_OUT, refreshTokenValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.header(config.headers.refreshToken);
    const loggedOut = yield logOutUser(refreshToken);
    res.send({ loggedOut });
})));
module.exports = router;
