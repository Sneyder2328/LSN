const env = (process.env.NODE_ENV || 'development').trim();

if (env === 'development' || env === 'test') {
    const envConfig = require('./config.json')[env];
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
    jwtSecret: process.env.JWT_SECRET
};
Object.freeze(config);
module.exports = {config};
