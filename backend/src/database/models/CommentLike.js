module.exports = (sequelize, DataTypes, User, Comment) => {
    const CommentLike = sequelize.define('Comment_Like', {
        commentId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'commentId_userId',
            references: {
                model: Comment,
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'commentId_userId',
            references: {
                model: User,
                key: 'id'
            }
        }
    });
    CommentLike.removeAttribute('id');

    CommentLike.beforeCreate(async (commentLike, _) => {
        const comment = await Comment.findByPk(commentLike.commentId);
        await comment.increment('likes', {by: 1});
    });

    return CommentLike;
};