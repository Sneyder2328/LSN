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
const { Comment, Post, PostLike, Profile } = database_1.models;
const constants_1 = require("../../utils/constants");
const utils_1 = require("../../utils/utils");
const PostNotCreatedError_1 = require("../../utils/errors/PostNotCreatedError");
function createPost(userId, type, text, img) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield Post.create({ id: utils_1.genUUID(), userId, type, text, img });
        if (!post)
            throw new PostNotCreatedError_1.PostNotCreatedError();
        const response = post.toJSON();
        response.authorProfile = (yield Profile.findByPk(userId)).toJSON();
        response.comments = [];
        return response;
    });
}
exports.createPost = createPost;
function getPosts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let posts = yield Post.findAll({
            include: [
                {
                    model: Profile,
                    as: 'authorProfile'
                },
                {
                    model: Comment,
                    as: 'comments',
                    limit: constants_1.LIMIT_COMMENTS_PER_POST,
                    order: [['createdAt', 'DESC']],
                    include: [Profile]
                }
            ]
        });
        // @ts-ignore
        const fetchLikeStatus = (postId, userId) => __awaiter(this, void 0, void 0, function* () { return (yield PostLike.findOne({ where: { postId, userId } })); });
        console.log('new version 1.2');
        const likeStatusList = yield Promise.all(posts.map(post => fetchLikeStatus(post.id, userId)));
        console.log('likeStatusList', likeStatusList);
        posts = posts.map(post => post.toJSON()).map(post => {
            const likeStatus = likeStatusList.filter(it => it != null).find((postLike) => postLike.postId === post.id);
            return Object.assign(Object.assign({}, post), { likeStatus: likeStatus != null ? (likeStatus.isLike === true ? 'like' : 'dislike') : undefined, comments: post.comments.map(comment => {
                    comment.authorProfile = comment.Profile;
                    delete comment.Profile;
                    return comment;
                }).sort(utils_1.compareByDateDesc) });
        }).sort(utils_1.compareByDateAsc);
        if (!posts)
            return [];
        return posts;
    });
}
exports.getPosts = getPosts;
function likePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const currentLikePost = yield PostLike.findOne({ where: { userId, postId } });
        if (currentLikePost) {
            if (currentLikePost.isLike === false && (yield currentLikePost.update({ isLike: true })) != null)
                return getFindByPk(postId);
            return false;
        }
        // @ts-ignore
        if ((yield PostLike.create({ userId, postId, isLike: true })) != null)
            return getFindByPk(postId);
    });
}
exports.likePost = likePost;
function removeLikeOrDislikePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const postLike = yield PostLike.findOne({ where: { userId, postId } });
        if ((yield postLike.destroy()) != null)
            return getFindByPk(postId);
        return false;
    });
}
exports.removeLikeOrDislikePost = removeLikeOrDislikePost;
function getFindByPk(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        return Post.findByPk(postId, {
            attributes: ['id', 'likesCount', 'dislikesCount']
        });
    });
}
function dislikePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const currentLikePost = yield PostLike.findOne({ where: { userId, postId } });
        if (currentLikePost) {
            if (currentLikePost.isLike === true && (yield currentLikePost.update({ isLike: false })) != null)
                return getFindByPk(postId);
            return false;
        }
        // @ts-ignore
        if ((yield PostLike.create({ userId, postId, isLike: false })) != null)
            return getFindByPk(postId);
    });
}
exports.dislikePost = dislikePost;
