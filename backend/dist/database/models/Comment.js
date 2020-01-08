"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    Comment.beforeCreate((comment, _) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield Post.findByPk(comment.postId);
        yield post.increment('commentsCount', { by: 1 });
    }));
    return Comment;
};
