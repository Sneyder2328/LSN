const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');

const PostLike = sequelize.define('Post_Like', {
    postId: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    userId: {
        type: DataTypes.BLOB,
        allowNull: false
    }
});

module.exports = {PostLike};