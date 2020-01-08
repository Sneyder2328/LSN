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
const { Router } = require('express');
const { createComment, likeComment, dislikeComment, removeLikeOrDislikeComment, getComments } = require('../services/comment');
const authenticate = require('../middlewares/authenticate');
const { createCommentValidationRules, likeCommentValidationRules, getCommentsValidationRules, validate } = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const httpCodes = require('../utils/constants/httpResponseCodes');
const endpoints = require('../utils/constants/endpoints');
const router = Router();
router.post(endpoints.comment.CREATE_COMMENT(':postId'), authenticate, createCommentValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield createComment(req.userId, req.params.postId, req.body);
    res.status(httpCodes.CREATED).send(response);
})));
router.post(endpoints.comment.LIKE_COMMENT(':commentId'), authenticate, likeCommentValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield likeComment(req.userId, req.params.commentId);
    res.status(httpCodes.OK).send(response);
})));
router.delete(endpoints.comment.LIKE_COMMENT(':commentId'), authenticate, likeCommentValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield removeLikeOrDislikeComment(req.userId, req.params.commentId);
    res.status(httpCodes.OK).send(response);
})));
router.post(endpoints.comment.DISLIKE_COMMENT(':commentId'), authenticate, likeCommentValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield dislikeComment(req.userId, req.params.commentId);
    res.status(httpCodes.OK).send(response);
})));
router.delete(endpoints.comment.DISLIKE_COMMENT(':commentId'), authenticate, likeCommentValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield removeLikeOrDislikeComment(req.userId, req.params.commentId);
    res.status(httpCodes.OK).send(response);
})));
router.get(endpoints.comment.GET_COMMENTS(':postId'), authenticate, getCommentsValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield getComments(req.params.postId, req.query.offset, req.query.limit);
    res.status(httpCodes.OK).send(response);
})));
module.exports = router;
