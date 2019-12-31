module.exports = (sequelize, DataTypes, User, Post) => {
    const Comment = sequelize.define('Comment', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('text', 'img'),
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        likesCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        dislikesCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    Comment.beforeCreate(async (comment, _) => {
        console.log('beforeCreate');
        const post = await Post.findByPk(comment.postId);
        const res = await post.increment('commentsCount', {by: 1});
        console.log('response in create', res);
    });

    return Comment;
};