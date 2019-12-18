module.exports = (sequelize, DataTypes, User, Comment) => {
    return sequelize.define('Comment_Like',
        {
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
        }
    );
};