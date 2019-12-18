const uuid = require('uuid');
const bcrypt = require('bcryptjs');

/**
 * gen hex(uuid) for user,post,comment,etc
 */
function genUUID() {
    return uuid.v4();
}

async function hashPassword(saltRounds = 10, password) {
    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) reject(err);
            resolve(hash)
        });
    });
}

async function verifyPassword(password, hashedPassword) {
    return await new Promise(((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, success) => {
            if (err || !success) resolve(false);
            resolve(true);
        });
    }));
}

module.exports = {genUUID, hashPassword, verifyPassword};