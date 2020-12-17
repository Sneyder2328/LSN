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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database/database");
const { Comment, CommentLike, Profile } = database_1.models;
const CommentNotCreatedError_1 = require("../../utils/errors/CommentNotCreatedError");
const utils_1 = require("../../utils/utils");
const AppError_1 = require("../../utils/errors/AppError");
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const notificationService_1 = require("../notification/notificationService");
const postService_1 = require("../post/postService");
function createComment(userId, postId, { id, type, text, img }) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield Comment.create({ id, userId, postId, type, text, img });
        if (!comment)
            throw new CommentNotCreatedError_1.CommentNotCreatedError();
        const response = comment.toJSON();
        response.authorProfile = (yield Profile.findByPk(userId)).toJSON();
        const postAuthorId = yield postService_1.getPostAuthorId(postId);
        notificationService_1.generateNotification(id, postAuthorId, userId, notificationService_1.ActivityType.POST_COMMENTED, postId);
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
        // generateNotification(commentId, id of comment author, userId, 'comment_liked'); TODO
        const { postId, postAuthorId } = yield getPostAuthorIdFromComment(commentId);
        notificationService_1.generateNotification(commentId, postAuthorId, userId, notificationService_1.ActivityType.COMMENT_LIKED, postId);
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
function getPostAuthorIdFromComment(commentId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield database_1.sequelize.query(`
SELECT U.userId as userId, P.id as postId
FROM Comment C
         JOIN Post P ON C.postId = P.id
         JOIN Profile U ON U.userId = P.userId
WHERE C.id = '${commentId}'
`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        // @ts-ignore
        return { postAuthorId: (_a = result[0]) === null || _a === void 0 ? void 0 : _a.userId, postId: (_b = result[0]) === null || _b === void 0 ? void 0 : _b.postId };
    });
}
exports.getPostAuthorIdFromComment = getPostAuthorIdFromComment;
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
function getComments(userId, postId, offset, limit) {
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
        const commentLikeStatusList = (yield Promise.all(comments.map(comment => exports.fetchCommentLikeStatus(comment.id, userId)))).filter(it => it != null);
        console.log('commentLikeStatusList', commentLikeStatusList);
        comments = comments.map(it => it.toJSON()).map(comment => {
            const commentLikeStatus = commentLikeStatusList.find((commentLike) => commentLike.commentId === comment.id);
            comment.likeStatus = commentLikeStatus != null ? (commentLikeStatus.isLike === true ? 'like' : 'dislike') : undefined;
            comment.authorProfile = comment.Profile;
            delete comment.Profile;
            return comment;
        }).sort(utils_1.compareByDateDesc);
        return comments;
    });
}
exports.getComments = getComments;
function getCommentPreview(commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield Comment.findByPk(commentId);
        if (!comment)
            throw new AppError_1.AppError(httpResponseCodes_1.default.NOT_FOUND, 'Not found', 'Comment not found');
        return comment;
    });
}
exports.getCommentPreview = getCommentPreview;
// @ts-ignore
exports.fetchCommentLikeStatus = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield CommentLike.findOne({
        where: {
            commentId,
            userId
        }
    }));
});
