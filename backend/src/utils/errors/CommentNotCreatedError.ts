import {AppError} from "./AppError";
import httpCodes from "../constants/httpResponseCodes";
import error from "../constants/errors";

export class CommentNotCreatedError extends AppError {
    constructor(message = error.POST_NOT_CREATED) {
        super(httpCodes.BAD_REQUEST, error.POST_NOT_CREATED, message);
    }
}