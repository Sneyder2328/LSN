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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, DataTypes, User, Comment) => {
    const CommentLike = sequelize.define('Comment_Like', {
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
        },
        isLike: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });
    CommentLike.removeAttribute('id');
    CommentLike.afterCreate((commentLike, _) => __awaiter(void 0, void 0, void 0, function* () {
        const comment = yield Comment.findByPk(commentLike.commentId);
        if (commentLike.isLike)
            yield comment.increment('likesCount', { by: 1 });
        else
            yield comment.increment('dislikesCount', { by: 1 });
    }));
    CommentLike.afterUpdate((commentLike, _) => __awaiter(void 0, void 0, void 0, function* () {
        const comment = yield Comment.findByPk(commentLike.commentId);
        if (commentLike.isLike) {
            yield comment.increment('likesCount', { by: 1 });
            yield comment.decrement('dislikesCount', { by: 1 });
        }
        else {
            yield comment.increment('dislikesCount', { by: 1 });
            yield comment.decrement('likesCount', { by: 1 });
        }
    }));
    CommentLike.beforeDestroy((commentLike, _) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('beforeDestroy');
        const comment = yield Comment.findByPk(commentLike.commentId);
        if (commentLike.isLike)
            yield comment.decrement('likesCount', { by: 1 });
        else
            yield comment.decrement('dislikesCount', { by: 1 });
    }));
    return CommentLike;
};
