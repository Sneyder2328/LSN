module.exports = (err, req, res, _) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(err);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message
    });
};