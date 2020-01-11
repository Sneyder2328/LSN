import jwt from "jsonwebtoken";
import config from "../config/config";
import {AuthError} from "../utils/errors/AuthError";
import error from "../utils/constants/errors";
import {verifyJWT} from "../helpers/JWTHelper";

export default async (req, res, next) => {
    const accessToken = req.header(config.headers.accessToken);
    if (!config.regex.jwt.test(accessToken))
        return next(new AuthError('accessToken', error.message.ACCESS_TOKEN_INVALID), req, res, next);
    try {
        const decodedPayload = await verifyJWT(accessToken);
        req.userId = decodedPayload.id;
        next();
    } catch (e) {
        const isTokenExpiredError = e instanceof jwt.TokenExpiredError;
        return next(new AuthError('accessToken', isTokenExpiredError ? error.message.ACCESS_TOKEN_EXPIRED : error.message.ACCESS_TOKEN_INVALID), req, res, next);
    }
};