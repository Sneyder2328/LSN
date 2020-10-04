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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_1 = __importDefault(require("../../config/config"));
const database_1 = require("../../database/database");
const { Profile, Token, User } = database_1.models;
const authService_1 = __importDefault(require("./authService"));
const service = new authService_1.default(Profile, Token, User);
const handleErrorAsync_1 = require("../../middlewares/handleErrorAsync");
const endpoints_1 = __importDefault(require("../../utils/constants/endpoints"));
const validate_1 = require("../../middlewares/validate");
const router = express_1.Router();
router.post(endpoints_1.default.auth.SIGN_UP, validate_1.signUpValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken, profile } = yield service.signUpUser(req.body);
    res.header(config_1.default.headers.accessToken, accessToken)
        .header(config_1.default.headers.refreshToken, refreshToken)
        .send({ access: true, profile });
})));
router.post(endpoints_1.default.auth.LOG_IN, validate_1.logInValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = yield service.logInUser(req.body);
    res.header(config_1.default.headers.accessToken, accessToken)
        .header(config_1.default.headers.refreshToken, refreshToken)
        .send({ access: true });
})));
router.get(endpoints_1.default.auth.REFRESH_TOKEN, validate_1.refreshTokenValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.header(config_1.default.headers.refreshToken);
    const accessToken = yield service.genNewAccessToken(refreshToken);
    res.header(config_1.default.headers.accessToken, accessToken)
        .send({ accessTokenIssued: true });
})));
router.delete(endpoints_1.default.auth.LOG_OUT, validate_1.refreshTokenValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.header(config_1.default.headers.refreshToken);
    const loggedOut = yield service.logOutUser(refreshToken);
    res.send({ loggedOut });
})));
exports.default = router;
