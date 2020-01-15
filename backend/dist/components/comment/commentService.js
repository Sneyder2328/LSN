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
const database_1 = require("../../database/database");
const { Comment, CommentLike, Profile } = database_1.models;
const CommentNotCreatedError_1 = require("../../utils/errors/CommentNotCreatedError");
const utils_1 = require("../../utils/utils");
function createComment(userId, postId, { id, type, text, img }) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield Comment.create({ id, userId, postId, type, text, img });
        if (!comment)
            throw new CommentNotCreatedError_1.CommentNotCreatedError();
        const response = comment.toJSON();
        response.authorProfile = (yield Profile.findByPk(userId)).toJSON();
        return response;
    });
}
exports.createComment = createComment;
function likeComment(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentLike = yield CommentLike.upsert({ userId, commentId, isLike: true });
        return commentLike !== null;
    });
}
exports.likeComment = likeComment;
function removeLikeOrDislikeComment(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentLike = yield CommentLike.findOne({ where: { userId, commentId } });
        return (yield commentLike.destroy()) != null;
    });
}
exports.removeLikeOrDislikeComment = removeLikeOrDislikeComment;
function dislikeComment(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentLike = yield CommentLike.upsert({ userId, commentId, isLike: false });
        return commentLike !== null;
    });
}
exports.dislikeComment = dislikeComment;
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
        }).sort(utils_1.compareByDateDesc);
        return comments;
    });
}
exports.getComments = getComments;
