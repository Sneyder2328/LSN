module.exports = (sequelize, DataTypes, User) => {
    return sequelize.define('Comment',
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
                allowNull: false
            },
            likes: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }
    );
};