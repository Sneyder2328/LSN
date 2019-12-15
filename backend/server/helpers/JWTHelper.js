const jwt = require('jsonwebtoken');

const signJWT = (id) => {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn: "15 minutes"} // 15 minutes
    ).toString();
};

const verifyJWT = (accessToken) => jwt.verify(accessToken, process.env.JWT_SECRET);

module.exports = {signJWT, verifyJWT};