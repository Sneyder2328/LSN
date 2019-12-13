const {sequelize} = require('../database');
const {DataTypes} = require('sequelize');

const Profile = sequelize.define('Profile',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coverPhotoUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profilePhotoUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = {Profile};