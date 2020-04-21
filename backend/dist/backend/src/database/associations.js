"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (models) => {
    const { Profile, Post, PostImage, Comment } = models;
    Profile.hasMany(Post, { as: 'authorProfile', foreignKey: 'userId' });
    Post.belongsTo(Profile, { as: 'authorProfile', foreignKey: 'userId' });
    Profile.hasMany(Comment, { foreignKey: 'userId' });
    Comment.belongsTo(Profile, { foreignKey: 'userId' });
    Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' });
    Comment.belongsTo(Post, { as: 'comments', foreignKey: 'postId' });
    Post.hasMany(PostImage, { as: 'images', foreignKey: 'postId' });
    PostImage.belongsTo(Post, { as: 'images', foreignKey: 'postId' });
    return models;
};
