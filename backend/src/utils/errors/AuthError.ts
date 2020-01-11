import {AppError} from "./AppError";
import httpCodes from "../constants/httpResponseCodes";

export class AuthError extends AppError {
    constructor(error, message = '') {
        super(httpCodes.UNAUTHORIZED, error, message);
    }
}