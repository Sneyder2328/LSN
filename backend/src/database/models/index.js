module.exports = (sequelize, Sequelize) => {
    const Token = require('./Token')(sequelize, Sequelize);
    const User = require('./User')(sequelize, Sequelize);
    const Profile = require('./Profile')(sequelize, Sequelize, User);
    const UserRelationShip = require('./UserRelationship')(sequelize, Sequelize);
    const Post = require('./Post')(sequelize, Sequelize, User);
    const PostLike = require('./PostLike')(sequelize, Sequelize, User, Post);
    const Comment = require('./Comment')(sequelize, Sequelize, User);
    const CommentLike = require('./CommentLike')(sequelize, Sequelize, User, Comment);

    return {Token, User, Profile, UserRelationShip, Post, PostLike, Comment, CommentLike}
};