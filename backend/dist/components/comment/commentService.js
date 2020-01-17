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
        return interactWithComment(userId, commentId, true);
    });
}
exports.likeComment = likeComment;
function dislikeComment(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return interactWithComment(userId, commentId, false);
    });
}
exports.dislikeComment = dislikeComment;
function interactWithComment(userId, commentId, isLike) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const currentCommentLike = yield CommentLike.findOne({ where: { userId, commentId } });
        if (currentCommentLike) {
            if (currentCommentLike.isLike === !isLike && (yield currentCommentLike.update({ isLike })) != null) {
                return findCommentLikesInfoByPk(commentId);
            }
        }
        // @ts-ignore
        else if ((yield CommentLike.create({ userId, commentId, isLike })) != null)
            return findCommentLikesInfoByPk(commentId);
        return false;
    });
}
function removeLikeOrDislikeComment(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const commentLike = yield CommentLike.findOne({ where: { userId, commentId } });
        if ((yield commentLike.destroy()) != null)
            return findCommentLikesInfoByPk(commentId);
        return false;
    });
}
exports.removeLikeOrDislikeComment = removeLikeOrDislikeComment;
function findCommentLikesInfoByPk(commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield Comment.findByPk(commentId, {
            attributes: ['id', 'likesCount', 'dislikesCount']
        })).dataValues;
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
        }).sort(utils_1.compareByDateDesc);
        return comments;
    });
}
exports.getComments = getComments;
