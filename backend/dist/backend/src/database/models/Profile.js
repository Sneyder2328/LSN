"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, DataTypes, User) => {
    return sequelize.define('Profile', {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: User,
                key: 'userId'
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
                model: User,
                key: 'username'
            }
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coverPhotoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profilePhotoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};
