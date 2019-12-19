module.exports = (sequelize, DataTypes, User, Post) => {
    const PostLike = sequelize.define('Post_Like', {
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'postId_userId',
            references: {
                model: Post,
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'postId_userId',
            references: {
                model: User,
                key: 'id'
            }
        }
    });
    PostLike.removeAttribute('id');

    PostLike.beforeCreate(async (postLike, _) => {
        const post = await Post.findByPk(postLike.postId);
        await post.increment('likes', {by: 1});
    });

    return PostLike;
};