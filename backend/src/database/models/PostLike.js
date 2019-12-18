module.exports = (sequelize, DataTypes, User, Post) => {
    return sequelize.define('Post_Like', {
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
};