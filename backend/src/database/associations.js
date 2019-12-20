module.exports = (models) => {
    const {Token, User, Profile, UserRelationShip, Post, PostLike, Comment, CommentLike} = models;
    Profile.hasMany(Post, {foreignKey: 'userId'});
    Post.belongsTo(Profile, {foreignKey: 'userId'});
    return models;
};