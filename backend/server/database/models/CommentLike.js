const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');
const {User} = require('./User');
const {Comment} = require('./Comment');

const CommentLike = sequelize.define('Comment_Like',
    {
        commentId: {
            type: DataTypes.BLOB,
            allowNull: false,
            unique: 'commentId_userId',
            references: {
                model: Comment,
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.BLOB,
            allowNull: false,
            unique: 'commentId_userId',
            references: {
                model: User,
                key: 'id'
            }
        }
    }
);

module.exports = {CommentLike};