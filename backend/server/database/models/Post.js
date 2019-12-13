const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');

const Post = sequelize.define('Post', {
    id: {
        primaryKey: true,
        type: DataTypes.BLOB,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comments: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('text', 'img'),
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = {Post};