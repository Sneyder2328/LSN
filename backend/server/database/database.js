const {Config} = require('../config/config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(Config.MYSQL_DATABASE, Config.MYSQL_USER, Config.MYSQL_PASSWORD, {
    host: Config.MYSQL_HOST,
    dialect: 'mariadb',
    dialectOptions: {
        timezone: Config.DB_TIMEZONE
    },
    define: {
        timestamps: false,
        freezeTableName: true
    },
});

module.exports = {sequelize};