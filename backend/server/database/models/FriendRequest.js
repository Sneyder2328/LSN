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
            allowNull: false
        },
        receiverId: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        accepted: {
            type: DataTypes.TINYINT,
            allowNull: false
        }
    }
);

module.exports = {FriendRequest};