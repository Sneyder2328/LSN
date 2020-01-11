import {AppError} from "../utils/errors/AppError";
import error from "../utils/constants/errors";
import httpCodes from "../utils/constants/httpResponseCodes";

/**
 * Handle undefined routes
 * @param req
 * @param res
 * @param next
 */
export default (req, res, next) => {
    const err = new AppError(httpCodes.NOT_FOUND, error.NOT_FOUND, error.message.UNDEFINED_ROUTE);
    next(err, req, res, next);
};