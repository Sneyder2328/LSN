import {Router} from "express";
import config from "../../config/config";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import endpoints from "../../utils/constants/endpoints";
import {
    logInValidationRules,
    refreshTokenValidationRules, signUpValidationRules,
    validate
} from "../../middlewares/validate";
import {genNewAccessToken, logInUser, logOutUser, signUpUser} from "./authService";
const router = Router();

/**
 * Create profile for new user
 */
router.post(endpoints.user.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {accessToken, refreshToken, profile} = await signUpUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true, profile});
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {accessToken, refreshToken, profile} = await logInUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .header(config.headers.refreshToken, refreshToken)
        .send({access: true, profile});
}));

router.get(endpoints.auth.REFRESH_TOKEN, refreshTokenValidationRules, validate, handleErrorAsync(async (req, res) => {
    const refreshToken = req.header(config.headers.refreshToken);
    const accessToken = await genNewAccessToken(refreshToken);
    res.header(config.headers.accessToken, accessToken)
        .send({accessTokenIssued: true});
}));

router.delete(endpoints.auth.LOG_OUT, refreshTokenValidationRules, validate, handleErrorAsync(async (req, res) => {
    const refreshToken = req.header(config.headers.refreshToken);
    const loggedOut = await logOutUser(refreshToken);
    res.send({loggedOut})
}));

export default router;