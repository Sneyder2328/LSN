"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configFile_json_1 = __importDefault(require("./configFile.json"));
const env = (process.env.NODE_ENV || 'development').trim();
if (env === 'development' || env === 'test' && configFile_json_1.default) {
    const envConfig = configFile_json_1.default[env];
    Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
}
const config = {
    server: {
        port: process.env.PORT
    },
    orm: {
        dialect: 'mariadb',
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        timeZone: process.env.DB_TIMEZONE,
    },
    auth: {
        accessTokenLifeTime: 15 * 60 // 15 minutes(in seconds)
    },
    headers: {
        accessToken: 'authorization',
        refreshToken: 'authorization-refresh-token'
    },
    regex: {
        jwt: /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        uuidV4: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    },
    jwtSecret: process.env.JWT_SECRET || ""
};
console.log(" exportando weon config=", config);
exports.default = config;
