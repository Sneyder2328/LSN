const uuid = require('uuid');

const {sequelize, Token, User, Profile, FriendRequest, Post, PostLike, Comment, CommentLike} = require('../src/database/database');

async function wipeOutDatabase() {
    const destroyOptions = {
        truncate: true,
        cascade: true
    };
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null); // Important to avoid error(see https://stackoverflow.com/questions/253849/cannot-truncate-table-because-it-is-being-referenced-by-a-foreign-key-constraint)
    await Comment.destroy(destroyOptions);
    await Post.destroy(destroyOptions);
    await Token.destroy(destroyOptions);
    await FriendRequest.destroy(destroyOptions);
    await CommentLike.destroy(destroyOptions);
    await PostLike.destroy(destroyOptions);
    await Profile.destroy(destroyOptions);
    await User.destroy(destroyOptions);
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null);
}

async function createUserAndProfile(userData, profileData, includeToken = false) {
    const user = await User.create(userData);
    const profile = await Profile.create(profileData);
    if (includeToken) {
        const token = await Token.create({userId: userData.id, token: uuid.v4()});
        return {user, profile, token};
    }
    return {user, profile};
}

module.exports = {wipeOutDatabase, createUserAndProfile};