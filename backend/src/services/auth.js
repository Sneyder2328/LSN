const uuid = require('uuid');
const {signJWT} = require('../helpers/JWTHelper');
const {User, Profile, Token} = require('../database/database');
const AppError = require('../utils/errors/AppError');
const AuthError = require('../utils/errors/AuthError');
const error = require('../utils/constants/errors');
const httpCodes = require('../utils/constants/httpResponseCodes');
const {genUUID, verifyPassword} = require('../utils/utils');

async function signUpUser({username, fullname, password, typeLogin, email, description, coverPhotoUrl, profilePhotoUrl}) {
    const currentUserWithUsername = await User.findOne({where: {username}});
    if (currentUserWithUsername) throw new AppError(httpCodes.CONFLICT, error.CONFLICT_ERROR, error.message.USERNAME_TAKEN);
    const currentUserWithEmail = await User.findOne({where: {email}});
    if (currentUserWithEmail) throw new AppError(httpCodes.CONFLICT, error.CONFLICT_ERROR, error.message.EMAIL_TAKEN);

    let userId = genUUID();
    const user = await User.create({
        id: userId,
        username: username,
        typeLogin: typeLogin,
        email: email,
        password: password
    });
    await Profile.create({
        userId,
        username: username,
        fullname: fullname,
        description: description,
        coverPhotoUrl: coverPhotoUrl,
        profilePhotoUrl: profilePhotoUrl
    });
    const accessToken = await user.generateAccessToken();
    const refreshToken = uuid.v4();
    await Token.create({userId, token: refreshToken});
    return {accessToken, refreshToken};
}

async function logInUser({username, password}) {
    const user = await User.findOne({where: {username}});
    if (!user) throw new AuthError(error.message.INCORRECT_USERNAME);

    const loggedIn = await verifyPassword(password, user.dataValues.password);
    if (!loggedIn) throw new AuthError(error.message.INCORRECT_PASSWORD);

    const accessToken = await user.generateAccessToken();
    const refreshToken = uuid.v4();
    await Token.create({userId: user.dataValues.id, token: refreshToken});
    return {accessToken, refreshToken};
}

async function logOutUser(refreshToken) {
    const rowsDeleted = await Token.destroy({where: {token: refreshToken}});
    if (rowsDeleted === 0) throw new AppError(httpCodes.BAD_REQUEST, 'Log out error', 'Log out error');
    return true;
}

async function genNewAccessToken(refreshToken) {
    const token = await Token.findByPk(refreshToken);
    if (!token) throw new AuthError(error.message.REFRESH_TOKEN_NOT_FOUND);
    const bufferId = token.dataValues.userId;
    const userId = [...bufferId];
    return await signJWT(userId);
}

module.exports = {signUpUser, logInUser, logOutUser, genNewAccessToken};