export default (sequelize, DataTypes, User) => {
    return sequelize.define('Post',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                allowNull: false
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: User,
                    key: 'id'
                }
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
            },
            commentsCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            text: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: ''
            }
        }
    );
};