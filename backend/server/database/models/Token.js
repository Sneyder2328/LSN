const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');
const {User} = require('./User');

const Token = sequelize.define('Token',
    {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.BLOB,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }
);

module.exports = {Token};