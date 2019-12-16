module.exports = (sequelize, DataTypes, User, Post) => {
    return sequelize.define('Post_Like', {
        postId: {
            type: DataTypes.BLOB,
            allowNull: false,
            unique: 'postId_userId',
            references: {
                model: Post,
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.BLOB,
            allowNull: false,
            unique: 'postId_userId',
            references: {
                model: User,
                key: 'id'
            }
        }
    });
};