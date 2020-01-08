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
const { Comment, CommentLike, Profile } = require('../database/database');
const CommentNotCreatedError = require('../utils/errors/CommentNotCreatedError');
function createComment(userId, postId, { id, type, text, img }) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield Comment.create({ id, userId, postId, type, text, img });
        if (!comment)
            throw new CommentNotCreatedError();
        const response = comment.toJSON();
        response.authorProfile = (yield Profile.findByPk(userId)).toJSON();
        return response;
    });
}
function likeComment(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentLike = yield CommentLike.upsert({ userId, commentId, isLike: true });
        return commentLike !== null;
    });
}
function removeLikeOrDislikeComment(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentLike = yield CommentLike.findOne({ where: { userId, commentId } });
        return (yield commentLike.destroy()) != null;
    });
}
function dislikeComment(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentLike = yield CommentLike.upsert({ userId, commentId, isLike: false });
        return commentLike !== null;
    });
}
function getComments(postId, offset, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        let comments = yield Comment.findAll({
            where: { postId },
            order: [['createdAt', 'DESC']],
            offset: parseInt(offset),
            limit: parseInt(limit),
            include: [{ model: Profile }]
        });
        if (!comments)
            return [];
        comments = comments.map(it => it.toJSON()).map(comment => {
            comment.authorProfile = comment.Profile;
            delete comment.Profile;
            return comment;
        });
        return comments;
    });
}
module.exports = { createComment, likeComment, dislikeComment, removeLikeOrDislikeComment, getComments };
