const {Config} = require('../config/config');
const Sequelize = require('sequelize');
console.log("creating new sequelize from database");
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


const Token = require('./models/Token')(sequelize, Sequelize);
const User = require('./models/User')(sequelize, Sequelize);
const Profile = require('./models/Profile')(sequelize, Sequelize, User);
const FriendRequest = require('./models/FriendRequest')(sequelize, Sequelize);
const Post = require('./models/Post')(sequelize, Sequelize, User);
const PostLike = require('./models/PostLike')(sequelize, Sequelize, User, Post);
const Comment = require('./models/Comment')(sequelize, Sequelize, User);
const CommentLike = require('./models/CommentLike')(sequelize, Sequelize, User, Comment);

Profile.hasMany(Post, {foreignKey: 'userId'});
Post.belongsTo(Profile, {foreignKey: 'userId'});

module.exports = {
    sequelize,
    Token,
    User,
    Profile,
    FriendRequest,
    Post,
    PostLike,
    Comment,
    CommentLike
};