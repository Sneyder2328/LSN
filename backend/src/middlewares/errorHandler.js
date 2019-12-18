const httpCodes = require('../utils/constants/httpResponseCodes');
module.exports = (err, req, res, _) => {
    err.statusCode = err.statusCode || httpCodes.INTERNAL_SERVER_ERROR;
    res.status(err.statusCode).json({
        error: err.name,
        message: err.message
    });
};