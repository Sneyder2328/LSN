const Sequelize = require('sequelize');

const {config} = require('../config/config');
const associateModels = require('./associations');

const sequelize = new Sequelize(config.orm.database, config.orm.user, config.orm.password, {
    host: config.orm.host,
    dialect: config.orm.dialect,
    dialectOptions: {
        timezone: config.orm.timeZone
    },
    define: {
        timestamps: false,
        freezeTableName: true
    },
});
const models = require('./models/index')(sequelize, Sequelize);
associateModels(models);

module.exports = {sequelize, ...models};