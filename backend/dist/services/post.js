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
const { LIMIT_COMMENTS_PER_POST } = require("../utils/constants");
const { Post, Profile, PostLike, Comment } = require('../database/database');
const { genUUID } = require('../utils/utils');
const PostNotCreatedError = require('../utils/errors/PostNotCreatedError');
function createPost(userId, type, text, img) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield Post.create({ id: genUUID(), userId, type, text, img });
        if (!post)
            throw new PostNotCreatedError();
        const response = post.toJSON();
        response.authorProfile = (yield Profile.findByPk(userId)).toJSON();
        response.comments = [];
        return response;
    });
}
function getPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        let posts = yield Post.findAll({
            include: [
                { model: Profile, as: 'authorProfile' },
                {
                    model: Comment,
                    as: 'comments',
                    limit: LIMIT_COMMENTS_PER_POST,
                    order: [['createdAt', 'DESC']],
                    include: [Profile]
                }
            ]
        });
        posts = posts.map(post => post.toJSON()).map(post => (Object.assign(Object.assign({}, post), { comments: post.comments.map(comment => {
                comment.authorProfile = comment.Profile;
                delete comment.Profile;
                return comment;
            }) })));
        if (!posts)
            return [];
        return posts;
    });
}
function likePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        return PostLike.upsert({ userId, postId, isLike: true });
    });
}
function removeLikeOrDislikePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const postLike = yield PostLike.findOne({ where: { userId, postId } });
        return (yield postLike.destroy()) != null;
    });
}
function dislikePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const postLike = yield PostLike.upsert({ userId, postId, isLike: false });
        return postLike !== null;
    });
}
module.exports = { createPost, getPosts, likePost, dislikePost, removeLikeOrDislikePost };
