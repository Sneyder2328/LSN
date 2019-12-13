const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');

const CommentLike = sequelize.define('Comment_Like',
    {
        commentId: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        userId: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    }
);

module.exports = {CommentLike};