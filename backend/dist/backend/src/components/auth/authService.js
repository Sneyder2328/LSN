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
const uuid_1 = __importDefault(require("uuid"));
const JWTHelper_1 = require("../../helpers/JWTHelper");
const AppError_1 = require("../../utils/errors/AppError");
const AuthError_1 = require("../../utils/errors/AuthError");
const errors_1 = __importDefault(require("../../utils/constants/errors"));
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const utils_1 = require("../../utils/utils");
class AuthService {
    constructor(Profile, Token, User) {
        this.Profile = Profile;
        this.Token = Token;
        this.User = User;
    }
    signUpUser({ username, fullname, password, typeLogin, email, description, coverPhotoUrl, profilePhotoUrl }) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const currentUserWithUsername = yield this.User.findOne({ where: { username } });
            if (currentUserWithUsername)
                throw new AppError_1.AppError(httpResponseCodes_1.default.CONFLICT, errors_1.default.USERNAME, errors_1.default.message.USERNAME_TAKEN);
            // @ts-ignore
            const currentUserWithEmail = yield this.User.findOne({ where: { email } });
            if (currentUserWithEmail)
                throw new AppError_1.AppError(httpResponseCodes_1.default.CONFLICT, errors_1.default.EMAIL, errors_1.default.message.EMAIL_TAKEN);
            let userId = utils_1.genUUID();
            // @ts-ignore
            const user = yield this.User.create({
                id: userId,
                username: username,
                typeLogin: typeLogin,
                email: email,
                password: password
            });
            yield this.Profile.create({
                userId,
                username: username,
                fullname: fullname,
                description: description,
                coverPhotoUrl: coverPhotoUrl,
                profilePhotoUrl: profilePhotoUrl
            });
            const accessToken = yield JWTHelper_1.signJWT(user.id);
            const refreshToken = uuid_1.default.v4();
            yield this.Token.create({ userId, token: refreshToken });
            return { accessToken, refreshToken };
        });
    }
    logInUser({ username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const user = yield this.User.findOne({ where: { username } });
            if (!user)
                throw new AuthError_1.AuthError(errors_1.default.USERNAME, errors_1.default.message.INCORRECT_USERNAME);
            const loggedIn = yield utils_1.verifyPassword(password, user.password);
            if (!loggedIn)
                throw new AuthError_1.AuthError(errors_1.default.PASSWORD, errors_1.default.message.INCORRECT_PASSWORD);
            const accessToken = yield JWTHelper_1.signJWT(user.id);
            const refreshToken = uuid_1.default.v4();
            yield this.Token.create({ userId: user.id, token: refreshToken });
            return { accessToken, refreshToken };
        });
    }
    logOutUser(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const rowsDeleted = yield this.Token.destroy({ where: { token: refreshToken } });
            if (rowsDeleted === 0)
                throw new AppError_1.AppError(httpResponseCodes_1.default.BAD_REQUEST, 'Log out error', 'Log out error');
            return true;
        });
    }
    genNewAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.Token.findByPk(refreshToken);
            if (!token)
                throw new AuthError_1.AuthError(errors_1.default.message.REFRESH_TOKEN_NOT_FOUND);
            return yield JWTHelper_1.signJWT(token.userId);
        });
    }
}
exports.default = AuthService;
