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
const { createPost, getPosts, likePost, dislikePost, removeLikeOrDislikePost } = require('../services/post');
const authenticate = require('../middlewares/authenticate');
const { createPostValidationRules, likePostValidationRules, validate } = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const httpCodes = require('../utils/constants/httpResponseCodes');
const endpoints = require('../utils/constants/endpoints');
const router = Router();
router.post(endpoints.post.CREATE_POST, authenticate, createPostValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body;
    const post = yield createPost(req.userId, content.type, content.text, content.img);
    res.status(httpCodes.CREATED).send(post);
})));
router.get(endpoints.post.GET_POSTS, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield getPosts();
    res.status(httpCodes.OK).send(posts);
})));
router.post(endpoints.post.LIKE_POST(':postId'), authenticate, likePostValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield likePost(req.userId, req.params.postId);
    res.status(httpCodes.OK).send(response);
})));
router.delete(endpoints.post.LIKE_POST(':postId'), authenticate, likePostValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield removeLikeOrDislikePost(req.userId, req.params.postId);
    res.status(httpCodes.OK).send(response);
})));
router.post(endpoints.post.DISLIKE_POST(':postId'), authenticate, likePostValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield dislikePost(req.userId, req.params.postId);
    res.status(httpCodes.OK).send(response);
})));
router.delete(endpoints.post.DISLIKE_POST(':postId'), authenticate, likePostValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield removeLikeOrDislikePost(req.userId, req.params.postId);
    res.status(httpCodes.OK).send(response);
})));
module.exports = router;
