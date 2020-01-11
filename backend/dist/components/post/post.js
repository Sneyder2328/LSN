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
const express_1 = require("express");
const postService_1 = require("./postService");
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const validate_1 = require("../../middlewares/validate");
const handleErrorAsync_1 = require("../../middlewares/handleErrorAsync");
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const endpoints_1 = __importDefault(require("../../utils/constants/endpoints"));
const router = express_1.Router();
router.post(endpoints_1.default.post.CREATE_POST, authenticate_1.default, validate_1.createPostValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body;
    const post = yield postService_1.createPost(req.userId, content.type, content.text, content.img);
    res.status(httpResponseCodes_1.default.CREATED).send(post);
})));
router.get(endpoints_1.default.post.GET_POSTS, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield postService_1.getPosts();
    res.status(httpResponseCodes_1.default.OK).send(posts);
})));
router.post(endpoints_1.default.post.LIKE_POST(':postId'), authenticate_1.default, validate_1.likePostValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield postService_1.likePost(req.userId, req.params.postId);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
router.delete(endpoints_1.default.post.LIKE_POST(':postId'), authenticate_1.default, validate_1.likePostValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield postService_1.removeLikeOrDislikePost(req.userId, req.params.postId);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
router.post(endpoints_1.default.post.DISLIKE_POST(':postId'), authenticate_1.default, validate_1.likePostValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield postService_1.dislikePost(req.userId, req.params.postId);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
router.delete(endpoints_1.default.post.DISLIKE_POST(':postId'), authenticate_1.default, validate_1.likePostValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield postService_1.removeLikeOrDislikePost(req.userId, req.params.postId);
    res.status(httpResponseCodes_1.default.OK).send(response);
})));
exports.default = router;
