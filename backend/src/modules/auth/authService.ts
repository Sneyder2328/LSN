import {signJWT} from "../../helpers/JWTHelper";
import {AppError} from "../../utils/errors/AppError";
import {AuthError} from "../../utils/errors/AuthError";
import error from "../../utils/constants/errors";
import httpCodes from "../../utils/constants/httpResponseCodes";
import {genUUID, verifyPassword} from "../../utils/utils";
import {models} from "../../database/database";
import {GENERATE_USERS_SUGGESTIONS, userSuggestionsEmitter} from "../user/userSuggestionsEmitter";
const {Profile,Token,User} = models;

export async function signUpUser({username, fullname, password, typeLogin, email, description, coverPhotoUrl, profilePhotoUrl}) {
    // @ts-ignore
    const currentUserWithUsername = await User.findOne({where: {username}});
    if (currentUserWithUsername) throw new AppError(httpCodes.CONFLICT, error.USERNAME, error.message.USERNAME_TAKEN);
    // @ts-ignore
    const currentUserWithEmail = await User.findOne({where: {email}});
    if (currentUserWithEmail) throw new AppError(httpCodes.CONFLICT, error.EMAIL, error.message.EMAIL_TAKEN);

    let userId = genUUID();
    // @ts-ignore
    const user = await User.create({
        id: userId,
        username: username,
        typeLogin: typeLogin,
        email: email,
        password: password
    });
    const newUserProfile = await Profile.create({
        userId,
        username: username,
        fullname: fullname,
        description: description,
        coverPhotoUrl: coverPhotoUrl,
        profilePhotoUrl: profilePhotoUrl
    });
    const accessToken = await signJWT(user.id);
    const refreshToken = genUUID()
    await Token.create({userId, token: refreshToken});
    userSuggestionsEmitter.emit(GENERATE_USERS_SUGGESTIONS, userId)
    return {accessToken, refreshToken, profile: newUserProfile};
}

export async function logInUser({username, password}) {
    // @ts-ignore
    const user = await User.findOne({where: {username}});
    if (!user) throw new AuthError(error.USERNAME, error.message.INCORRECT_USERNAME);

    const loggedIn = await verifyPassword(password, user.password);
    if (!loggedIn) throw new AuthError(error.PASSWORD, error.message.INCORRECT_PASSWORD);

    const accessToken = await signJWT(user.id);
    const refreshToken = genUUID()
    await Token.create({userId: user.id, token: refreshToken});

    const userProfile = await Profile.findByPk(user.id)
    return {accessToken, refreshToken, profile: userProfile};
}

export async function logOutUser(refreshToken) {
    const rowsDeleted = await Token.destroy({where: {token: refreshToken}});
    if (rowsDeleted === 0) throw new AppError(httpCodes.BAD_REQUEST, 'Log out error', 'Log out error');
    return true;
}

export async function genNewAccessToken(refreshToken) {
    const token = await Token.findByPk(refreshToken);
    if (!token) throw new AuthError(error.message.REFRESH_TOKEN_NOT_FOUND);
    return await signJWT(token.userId);
}