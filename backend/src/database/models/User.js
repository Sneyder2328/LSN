const {signJWT} = require('../../helpers/JWTHelper');

const ENUM_EMAIL = 'email';
const ENUM_FACEBOOK = 'facebook';
const ENUM_GOOGLE = 'google';

module.exports = (sequelize, DataTypes) => {
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
        }
    );

    User.prototype.generateAccessToken = async function () {
        const id = this.dataValues.id;
        return await signJWT(id);
    };

    return User;
};