const {Profile} = require('../database/database');
const UserNotFoundError = require('../utils/errors/UserNotFoundError');

async function getProfile(username) {
    const user = await Profile.findOne({where: {username}});
    if (!user) throw new UserNotFoundError();
    return user.dataValues;
}

module.exports = {getProfile};