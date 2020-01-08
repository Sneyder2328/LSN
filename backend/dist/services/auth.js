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
const uuid = require('uuid');
const { signJWT } = require('../helpers/JWTHelper');
const { User, Profile, Token } = require('../database/database');
const AppError = require('../utils/errors/AppError');
const AuthError = require('../utils/errors/AuthError');
const error = require('../utils/constants/errors');
const httpCodes = require('../utils/constants/httpResponseCodes');
const { genUUID, verifyPassword } = require('../utils/utils');
function signUpUser({ username, fullname, password, typeLogin, email, description, coverPhotoUrl, profilePhotoUrl }) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentUserWithUsername = yield User.findOne({ where: { username } });
        if (currentUserWithUsername)
            throw new AppError(httpCodes.CONFLICT, error.USERNAME, error.message.USERNAME_TAKEN);
        const currentUserWithEmail = yield User.findOne({ where: { email } });
        if (currentUserWithEmail)
            throw new AppError(httpCodes.CONFLICT, error.EMAIL, error.message.EMAIL_TAKEN);
        let userId = genUUID();
        const user = yield User.create({
            id: userId,
            username: username,
            typeLogin: typeLogin,
            email: email,
            password: password
        });
        yield Profile.create({
            userId,
            username: username,
            fullname: fullname,
            description: description,
            coverPhotoUrl: coverPhotoUrl,
            profilePhotoUrl: profilePhotoUrl
        });
        const accessToken = yield signJWT(user.id);
        const refreshToken = uuid.v4();
        yield Token.create({ userId, token: refreshToken });
        return { accessToken, refreshToken };
    });
}
function logInUser({ username, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ where: { username } });
        if (!user)
            throw new AuthError(error.USERNAME, error.message.INCORRECT_USERNAME);
        const loggedIn = yield verifyPassword(password, user.password);
        if (!loggedIn)
            throw new AuthError(error.PASSWORD, error.message.INCORRECT_PASSWORD);
        const accessToken = yield signJWT(user.id);
        const refreshToken = uuid.v4();
        yield Token.create({ userId: user.id, token: refreshToken });
        return { accessToken, refreshToken };
    });
}
function logOutUser(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const rowsDeleted = yield Token.destroy({ where: { token: refreshToken } });
        if (rowsDeleted === 0)
            throw new AppError(httpCodes.BAD_REQUEST, 'Log out error', 'Log out error');
        return true;
    });
}
function genNewAccessToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield Token.findByPk(refreshToken);
        if (!token)
            throw new AuthError(error.message.REFRESH_TOKEN_NOT_FOUND);
        return yield signJWT(token.userId);
    });
}
module.exports = { signUpUser, logInUser, logOutUser, genNewAccessToken };
