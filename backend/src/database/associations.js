module.exports = (models) => {
    const {Token, User, Profile, UserRelationShip, Post, PostLike, Comment, CommentLike} = models;

    Profile.hasMany(Post, {as: 'authorProfile', foreignKey: 'userId'});
    Post.belongsTo(Profile, {as: 'authorProfile', foreignKey: 'userId'});

    Profile.hasMany(Comment, {foreignKey: 'userId'});
    Comment.belongsTo(Profile, {foreignKey: 'userId'});

    Post.hasMany(Comment, {as: 'comments', foreignKey: 'postId'});
    Comment.belongsTo(Post, {as: 'comments', foreignKey: 'postId'});
    return models;
};