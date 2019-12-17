module.exports = (err, req, res, _) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        error: err.name,
        message: err.message
    });
};