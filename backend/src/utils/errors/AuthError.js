const AppError = require('./AppError');
const httpCodes = require('../constants/httpResponseCodes');
const error = require('../constants/errors');

class AuthError extends AppError {
    constructor(message = error.AUTH_ERROR) {
        super(httpCodes.UNAUTHORIZED, error.AUTH_ERROR, message);
    }
}

module.exports = AuthError;