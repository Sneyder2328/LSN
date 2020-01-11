export default (sequelize, DataTypes, User, Comment) => {
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
        },
        isLike: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });
    CommentLike.removeAttribute('id');

    CommentLike.beforeUpsert(async (commentLike, _) => {
        const comment = await Comment.findByPk(commentLike.commentId);
        if (commentLike.isLike)
            await comment.increment('likesCount', {by: 1});
        else
            await comment.increment('dislikesCount', {by: 1});
    });

    CommentLike.beforeDestroy(async (commentLike, _) => {
        console.log('beforeDestroy');
        const comment = await Comment.findByPk(commentLike.commentId);
        if (commentLike.isLike)
            await comment.decrement('likesCount', {by: 1});
        else
            await comment.decrement('dislikesCount', {by: 1});
    });

    return CommentLike;
};