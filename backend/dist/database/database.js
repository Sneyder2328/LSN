"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./models/index"));
const config_1 = __importDefault(require("../config/config"));
const associations_1 = __importDefault(require("./associations"));
// @ts-ignore
exports.sequelize = new sequelize_1.Sequelize(config_1.default.orm.database, config_1.default.orm.user, config_1.default.orm.password, {
    host: config_1.default.orm.host,
    dialect: config_1.default.orm.dialect,
    dialectOptions: { timezone: config_1.default.orm.timeZone },
    define: {
        timestamps: false,
        freezeTableName: true
    },
});
exports.models = index_1.default(exports.sequelize, sequelize_1.Sequelize);
associations_1.default(exports.models);
