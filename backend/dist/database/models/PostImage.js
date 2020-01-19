"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, DataTypes, Post) => {
    return sequelize.define('Post_Image', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'post_image_post_id',
            references: {
                model: Post,
                key: 'id'
            }
        },
        url: {
            type: DataTypes.STRING(500),
            allowNull: false
        }
    });
};
