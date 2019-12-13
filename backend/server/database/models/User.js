const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');

const User = sequelize.define('User',
    {
        id: {
            type: DataTypes.BLOB,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        typeLogin: {
            type: DataTypes.ENUM('email', 'facebook', 'google'),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.TIME,
            allowNull: false
        },
        lastConnection: {
            type: DataTypes.TIME,
            allowNull: false
        },
        language: {
            type: DataTypes.ENUM('en', 'es', 'fr'),
            allowNull: false
        }
    }
);

module.exports = {User};