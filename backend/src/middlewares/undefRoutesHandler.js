const AppError = require('../utils/errors/AppError');
const error = require('../utils/constants/errors');
const httpCodes = require('../utils/constants/httpResponseCodes');

/**
 * Handle undefined routes
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
    const err = new AppError(httpCodes.NOT_FOUND, error.NOT_FOUND, error.message.UNDEFINED_ROUTE);
    next(err, req, res, next);
};