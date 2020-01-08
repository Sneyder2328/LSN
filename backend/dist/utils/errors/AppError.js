"use strict";
const httpCodes = require('../constants/httpResponseCodes');
const error = require('../constants/errors');
class AppError extends Error {
    constructor(statusCode = httpCodes.INTERNAL_SERVER_ERROR, name = error.DEFAULT_ERROR, message = error.message.DEFAULT_ERROR) {
        super();
        this.statusCode = statusCode;
        this.name = name;
        this.message = message;
        Error.captureStackTrace(this, AppError);
    }
}
module.exports = AppError;
