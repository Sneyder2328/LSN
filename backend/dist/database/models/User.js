"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { signJWT } = require('../../helpers/JWTHelper');
const { hashPassword } = require('../../utils/utils');
const ENUM_EMAIL = 'email';
const ENUM_FACEBOOK = 'facebook';
const ENUM_GOOGLE = 'google';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
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
            type: DataTypes.ENUM(ENUM_EMAIL, ENUM_FACEBOOK, ENUM_GOOGLE),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.TIME,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        lastConnection: {
            type: DataTypes.TIME,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        language: {
            type: DataTypes.ENUM('en', 'es', 'fr'),
            allowNull: false,
            defaultValue: 'en'
        }
    });
    User.beforeSave((user, _) => __awaiter(void 0, void 0, void 0, function* () {
        return hashPassword(10, user.password).then(hashedPw => {
            user.password = hashedPw;
        });
    }));
    return User;
};
