const {Profile} = require('../database/database');
const AppError = require('../utils/AppError');

async function getProfile(username) {
    const user = await Profile.findOne({where: {username}});
    if (!user) throw new AppError(404, 0, 'User profile not found');
    return user.dataValues;
}

module.exports = {getProfile};