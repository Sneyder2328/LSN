"use strict";
const AppError = require('./AppError');
const httpCodes = require('../constants/httpResponseCodes');
const error = require('../constants/errors');
class CommentNotCreatedError extends AppError {
    constructor(message = error.POST_NOT_CREATED) {
        super(httpCodes.BAD_REQUEST, error.POST_NOT_CREATED, message);
    }
}
module.exports = CommentNotCreatedError;
