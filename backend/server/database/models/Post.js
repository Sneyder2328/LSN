const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');
const {User} = require('./User');

const Post = sequelize.define('Post', {
    id: {
        primaryKey: true,
        type: DataTypes.BLOB,
        allowNull: false
    },
    userId: {
        type: DataTypes.BLOB,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    comments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    type: {
        type: DataTypes.ENUM('text', 'img'),
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: true
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = {Post};