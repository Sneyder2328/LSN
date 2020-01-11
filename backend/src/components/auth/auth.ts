import {Router} from "express";
import config from "../../config/config";
import {models} from "../../database/database";
const {Profile, Token, User} = models;
import AuthService from "./authService";
const service = new AuthService(Profile, Token, User);
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import endpoints from "../../utils/constants/endpoints";
import {
    logInValidationRules,
    refreshTokenValidationRules,
    signUpValidationRules,
    validate
} from "../../middlewares/validate";
const router = Router();

router.post(endpoints.auth.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {accessToken, refreshToken} = await service.signUpUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true});
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {accessToken, refreshToken} = await service.logInUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true});
}));

router.get(endpoints.auth.REFRESH_TOKEN, refreshTokenValidationRules, validate, handleErrorAsync(async (req, res) => {
    const refreshToken = req.header(config.headers.refreshToken);
    const accessToken = await service.genNewAccessToken(refreshToken);
    res.header(config.headers.accessToken, accessToken)
        .send({accessTokenIssued: true});
}));

router.delete(endpoints.auth.LOG_OUT, refreshTokenValidationRules, validate, handleErrorAsync(async (req, res) => {
    const refreshToken = req.header(config.headers.refreshToken);
    const loggedOut = await service.logOutUser(refreshToken);
    res.send({loggedOut})
}));

export default router;