module.exports = (sequelize, DataTypes) => {
    return sequelize.define('FriendRequest',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            senderId: {
                type: DataTypes.UUID,
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
                allowNull: false,
                defaultValue: false
            }
        }
    );
};