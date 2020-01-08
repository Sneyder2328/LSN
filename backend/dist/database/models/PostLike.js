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
    const PostLike = sequelize.define('Post_Like', {
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'postId_userId',
            references: {
                model: Post,
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'postId_userId',
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
    PostLike.removeAttribute('id');
    PostLike.beforeUpsert((postLike, _) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('beforeUpsert');
        const post = yield Post.findByPk(postLike.postId);
        if (postLike.isLike)
            yield post.increment('likesCount', { by: 1 });
        else
            yield post.increment('dislikesCount', { by: 1 });
    }));
    PostLike.beforeDestroy((postLike, _) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('beforeDestroy');
        const post = yield Post.findByPk(postLike.postId);
        if (postLike.isLike)
            yield post.decrement('likesCount', { by: 1 });
        else
            yield post.decrement('dislikesCount', { by: 1 });
    }));
    return PostLike;
};
