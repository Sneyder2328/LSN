const uuid = require('uuid');
const {signJWT} = require('../helpers/JWTHelper');
const {User, Profile, Token} = require('../database/database');
const AppError = require('../utils/AppError');
const {genUUID, hashPassword, verifyPassword} = require('../utils/utils');

async function signUpUser({username, fullname, password, typeLogin, email, description, coverPhotoUrl, profilePhotoUrl}) {
    let userId = genUUID();
    const user = await User.create({
        id: userId,
        username: username,
        typeLogin: typeLogin,
        email: email,
        password: await hashPassword(10, password)
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
    //console.log("user =  ", user);
    if (!user) throw new AppError(401, 0, 'Incorrect username');

    const loggedIn = await verifyPassword(password, user.dataValues.password);
    if(!loggedIn) throw new AppError(401, 0, 'Incorrect username');

    const accessToken = user.generateAccessToken();
    const refreshToken = uuid.v4();
    await Token.create({userId: user.dataValues.id, token: refreshToken});
    return {accessToken, refreshToken};
}

async function genNewAccessToken(refreshToken){
    const token = await Token.findByPk(refreshToken);
    if (!token) throw new AppError(404, 0, 'Refresh token not found');
    const bufferId = token.dataValues.userId;
    const userId = [...bufferId];
    return await signJWT(userId);
}

module.exports = {signUpUser, logInUser, genNewAccessToken};