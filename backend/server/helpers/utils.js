const uuid = require('uuid');
const bcrypt = require('bcryptjs');

function genUUID() {
    let userId = [];
    uuid.v4(null, userId); // gen hex(uuid) for user,post,comment,etc
    return userId;
}

async function hashPassword(saltRounds = 10, password) {
    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) reject(err);
            resolve(hash)
        });
    });
}

module.exports = {genUUID, hashPassword};