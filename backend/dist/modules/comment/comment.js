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
const endpoints_1 = __importDefault(require("../../utils/constants/endpoints"));
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const handleErrorAsync_1 = require("../../middlewares/handleErrorAsync");
const validate_1 = require("../../middlewares/validate");
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const commentService_1 = require("./commentService");
const express_1 = require("express");
const router = express_1.Router();
/**
 * Create a new comment in a given post
 */
router.post(endpoints_1.default.comment.CREATE_COMMENT(':postId'), authenticate_1.default, validate_1.createCommentValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield commentService_1.createComment(req.userId, req.params.postId, req.body);
    res.status(httpResponseCodes_1.default.CREATED).send(response);
})));
/**
 * Add a like interaction to a comment
 */
router.post(endpoints_1.default.comment.LIKE_COMMENT(':commentId'), authenticate_1.default, validate_1.likeCommentValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield commentService_1.likeComment(req.userId, req.params.commentId);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
/**
 * Remove a like interaction to a comment
 */
router.delete(endpoints_1.default.comment.LIKE_COMMENT(':commentId'), authenticate_1.default, validate_1.likeCommentValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield commentService_1.removeLikeOrDislikeComment(req.userId, req.params.commentId);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
/**
 * Add a dislike interaction to a comment
 */
router.post(endpoints_1.default.comment.DISLIKE_COMMENT(':commentId'), authenticate_1.default, validate_1.likeCommentValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield commentService_1.dislikeComment(req.userId, req.params.commentId);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
/**
 * Remove a dislike interaction to a comment
 */
router.delete(endpoints_1.default.comment.DISLIKE_COMMENT(':commentId'), authenticate_1.default, validate_1.likeCommentValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield commentService_1.removeLikeOrDislikeComment(req.userId, req.params.commentId);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
/**
 * Get all comments by a given post
 */
router.get(endpoints_1.default.comment.GET_COMMENTS(':postId'), authenticate_1.default, validate_1.getCommentsValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield commentService_1.getComments2(req.userId, req.params.postId, req.query.limit, req.query.offset);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
exports.default = router;
