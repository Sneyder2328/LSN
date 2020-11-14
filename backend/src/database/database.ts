import {Sequelize} from "sequelize";
import models0 from "./models/index";
import config from "../config/config";
import associateModels from "./associations";

// @ts-ignore
export const sequelize = new Sequelize(config.orm.database!, config.orm.user!, config.orm.password, {
    host: config.orm.host,
    logging: false,
    dialect: config.orm.dialect,
    dialectOptions: {timezone: config.orm.timeZone},
    define: {
        timestamps: false,
        freezeTableName: true
    },
});

export const models = models0(sequelize, Sequelize);
associateModels(models);