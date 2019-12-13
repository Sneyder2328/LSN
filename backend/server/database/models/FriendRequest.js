const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');

const FriendRequest = sequelize.define('FriendRequest',
    {
        id: {
            type: DataTypes.BLOB,
            primaryKey: true,
            allowNull: false
        },
        senderId: {
            type: DataTypes.BLOB,
            allowNull: false,
            unique: 'user'
        },
        receiverId: {
            type: DataTypes.BLOB,
            allowNull: false,
            unique: 'user'
        },
        accepted: {
            type: DataTypes.TINYINT,
            allowNull: false
        }
    }
);

module.exports = {FriendRequest};