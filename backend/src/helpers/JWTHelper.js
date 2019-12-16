const jwt = require('jsonwebtoken');
const {config} = require('../config/config');

async function signJWT(id) {
    return jwt.sign(
        {id},
        config.jwtSecret,
        {expiresIn: config.auth.accessTokenLifeTime}
    );
}

async function verifyJWT(accessToken) {
    return jwt.verify(accessToken, config.jwtSecret);
}

module.exports = {signJWT, verifyJWT};