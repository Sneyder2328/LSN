const AppError = require('./AppError');
const httpCodes = require('../constants/httpResponseCodes');
const error = require('../constants/errors');

class PostNotCreatedError extends AppError {
    constructor(message) {
        super(httpCodes.BAD_REQUEST, error.POST_NOT_CREATED, message | error.POST_NOT_CREATED);
    }
}

module.exports = PostNotCreatedError;