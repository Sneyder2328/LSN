import error from "../constants/errors";
import httpCodes from "../constants/httpResponseCodes";

export class AppError extends Error {
    private statusCode: number;
    constructor(statusCode = httpCodes.INTERNAL_SERVER_ERROR, name = error.DEFAULT_ERROR, message = error.message.DEFAULT_ERROR) {
        super();
        this.statusCode = statusCode;
        this.name = name;
        this.message = message;
        Error.captureStackTrace(this, AppError);
    }
}