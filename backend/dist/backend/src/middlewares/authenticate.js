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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const AuthError_1 = require("../utils/errors/AuthError");
const errors_1 = __importDefault(require("../utils/constants/errors"));
const JWTHelper_1 = require("../helpers/JWTHelper");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.header(config_1.default.headers.accessToken);
    if (!config_1.default.regex.jwt.test(accessToken))
        return next(new AuthError_1.AuthError('accessToken', errors_1.default.message.ACCESS_TOKEN_INVALID), req, res, next);
    try {
        const decodedPayload = yield JWTHelper_1.verifyJWT(accessToken);
        req.userId = decodedPayload.id;
        next();
    }
    catch (e) {
        const isTokenExpiredError = e instanceof jsonwebtoken_1.default.TokenExpiredError;
        return next(new AuthError_1.AuthError('accessToken', isTokenExpiredError ? errors_1.default.message.ACCESS_TOKEN_EXPIRED : errors_1.default.message.ACCESS_TOKEN_INVALID), req, res, next);
    }
});
