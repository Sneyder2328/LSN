const jwt = require('jsonwebtoken');
const {User} = require('../database/models/User');
const {Token} = require('../database/models/Token');
const AUTH_ACCESS_TOKEN = 'Authorization-access-token';
const AUTH_REFRESH_TOKEN = 'Authorization-refresh-token';

const authenticate = (req, res, next) => {
    const accessToken = req.header(AUTH_ACCESS_TOKEN); // need to satinize
    try {
        const decodedPayload = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log("decodedPayload=", decodedPayload);
        req.userId = decodedPayload.id;
        next();
    } catch (e) {
        const isTokenExpiredError = e instanceof jwt.TokenExpiredError;
        console.log(isTokenExpiredError);
        console.log("error=", e);
        res.status(401).send({status: isTokenExpiredError ? "Access token expired" : "Access token not valid"});
    }
};

function getJWTFromId(id) {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn: "15 minutes"} // 15 minutes
    ).toString();
}

module.exports = {authenticate, AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN, getJWTFromId};