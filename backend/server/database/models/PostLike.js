const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');
const {User} = require('./User');
const {Post} = require('./Post');

const PostLike = sequelize.define('Post_Like', {
    postId: {
        type: DataTypes.BLOB,
        allowNull: false,
        unique: 'postId_userId',
        references: {
            model: Post,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.BLOB,
        allowNull: false,
        unique: 'postId_userId',
        references: {
            model: User,
            key: 'id'
        }
    }
});

module.exports = {PostLike};