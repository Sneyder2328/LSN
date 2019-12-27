const AppError = require('./AppError');
const httpCodes = require('../constants/httpResponseCodes');

class AuthError extends AppError {
    constructor(error, message) {
        super(httpCodes.UNAUTHORIZED, error, message);
    }
}

module.exports = AuthError;