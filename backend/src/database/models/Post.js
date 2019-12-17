module.exports = (sequelize, DataTypes, User) => {
    return sequelize.define('Post',
        {
            id: {
                primaryKey: true,
                type: DataTypes.BLOB,
                allowNull: false
            },
            userId: {
                type: DataTypes.BLOB,
                allowNull: false,
                references: {
                    model: User,
                    key: 'id'
                }
            },
            likes: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            comments: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            type: {
                type: DataTypes.ENUM('text', 'img'),
                allowNull: false
            },
            text: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: ''
            },
            img: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: ''
            }
        }
    );
};