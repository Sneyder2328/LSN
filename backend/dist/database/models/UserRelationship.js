"use strict";
module.exports = (sequelize, DataTypes) => {
    const UserRelationShip = sequelize.define('User_Relationship', {
        senderId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'user'
        },
        receiverId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'user'
        },
        type: {
            type: DataTypes.ENUM('friend', 'pending', 'block'),
            allowNull: false,
            defaultValue: 'pending'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });
    UserRelationShip.removeAttribute('id');
    return UserRelationShip;
};
