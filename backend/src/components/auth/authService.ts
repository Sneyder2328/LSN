import {signJWT} from "../../helpers/JWTHelper";
import {AppError} from "../../utils/errors/AppError";
import {AuthError} from "../../utils/errors/AuthError";
import error from "../../utils/constants/errors";
import httpCodes from "../../utils/constants/httpResponseCodes";
import {genUUID, verifyPassword} from "../../utils/utils";

export default class AuthService {
    constructor(
        private Profile,
        private Token,
        private User
    ){}
    async signUpUser({username, fullname, password, typeLogin, email, description, coverPhotoUrl, profilePhotoUrl}) {
        // @ts-ignore
        const currentUserWithUsername = await this.User.findOne({where: {username}});
        if (currentUserWithUsername) throw new AppError(httpCodes.CONFLICT, error.USERNAME, error.message.USERNAME_TAKEN);
        // @ts-ignore
        const currentUserWithEmail = await this.User.findOne({where: {email}});
        if (currentUserWithEmail) throw new AppError(httpCodes.CONFLICT, error.EMAIL, error.message.EMAIL_TAKEN);

        let userId = genUUID();
        // @ts-ignore
        const user = await this.User.create({
            id: userId,
            username: username,
            typeLogin: typeLogin,
            email: email,
            password: password
        });
        const newUserProfile = await this.Profile.create({
            userId,
            username: username,
            fullname: fullname,
            description: description,
            coverPhotoUrl: coverPhotoUrl,
            profilePhotoUrl: profilePhotoUrl
        });
        const accessToken = await signJWT(user.id);
        const refreshToken = genUUID()
        await this.Token.create({userId, token: refreshToken});
        return {accessToken, refreshToken, profile: newUserProfile};
    }

    async logInUser({username, password}) {
        // @ts-ignore
        const user = await this.User.findOne({where: {username}});
        if (!user) throw new AuthError(error.USERNAME, error.message.INCORRECT_USERNAME);

        const loggedIn = await verifyPassword(password, user.password);
        if (!loggedIn) throw new AuthError(error.PASSWORD, error.message.INCORRECT_PASSWORD);

        const accessToken = await signJWT(user.id);
        const refreshToken = genUUID()
        await this.Token.create({userId: user.id, token: refreshToken});
        return {accessToken, refreshToken};
    }

    async logOutUser(refreshToken) {
        const rowsDeleted = await this.Token.destroy({where: {token: refreshToken}});
        if (rowsDeleted === 0) throw new AppError(httpCodes.BAD_REQUEST, 'Log out error', 'Log out error');
        return true;
    }

    async genNewAccessToken(refreshToken) {
        const token = await this.Token.findByPk(refreshToken);
        if (!token) throw new AuthError(error.message.REFRESH_TOKEN_NOT_FOUND);
        return await signJWT(token.userId);
    }
}