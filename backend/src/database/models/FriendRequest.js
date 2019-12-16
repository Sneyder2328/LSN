module.exports = (sequelize, DataTypes) => {
    return sequelize.define('FriendRequest',
        {
            id: {
                type: DataTypes.BLOB,
                primaryKey: true,
                allowNull: false
            },
            senderId: {
                type: DataTypes.BLOB,
                allowNull: false,
                unique: 'user'
            },
            receiverId: {
                type: DataTypes.BLOB,
                allowNull: false,
                unique: 'user'
            },
            accepted: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        }
    );
};