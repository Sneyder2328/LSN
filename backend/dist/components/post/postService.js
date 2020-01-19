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
const constants_1 = require("../../utils/constants");
const utils_1 = require("../../utils/utils");
const PostNotCreatedError_1 = require("../../utils/errors/PostNotCreatedError");
const commentService_1 = require("../comment/commentService");
const { Comment, Post, PostLike, Profile, PostImage } = database_1.models;
function createPost(userId, type, text, images) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = utils_1.genUUID();
        const post = yield Post.create({ id: postId, userId, type, text });
        if (!post)
            throw new PostNotCreatedError_1.PostNotCreatedError();
        const response = post.toJSON();
        response.authorProfile = (yield Profile.findByPk(userId)).toJSON();
        response.comments = [];
        if (images) {
            response.images = yield Promise.all(images.map(url => PostImage.create({ id: utils_1.genUUID(), postId, url })));
        }
        else {
            response.images = [];
        }
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
                    model: PostImage,
                    as: 'images',
                    attributes: ['url']
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
        const postLikeStatusList = (yield Promise.all(posts.map(post => fetchPostLikeStatus(post.id, userId)))).filter(it => it != null);
        //console.log('postLikeStatusList', postLikeStatusList);
        const commentLikeStatusList = (yield Promise.all(posts.map(post => post.comments.map(comment => comment.id))
            .filter(it => it.lenght !== 0)
            .flat()
            .map(commentId => commentService_1.fetchCommentLikeStatus(commentId, userId)))).filter(it => it != null);
        //    console.log('commentLikeStatusList', commentLikeStatusList);
        posts = posts.map(post => post.toJSON()).map(post => {
            const postLikeStatus = postLikeStatusList.find((postLike) => postLike.postId === post.id);
            return Object.assign(Object.assign({}, post), { likeStatus: postLikeStatus != null ? (postLikeStatus.isLike === true ? 'like' : 'dislike') : undefined, comments: post.comments.map(comment => {
                    const commentLikeStatus = commentLikeStatusList.find((commentLike) => commentLike.commentId === comment.id);
                    comment.likeStatus = commentLikeStatus != null ? (commentLikeStatus.isLike === true ? 'like' : 'dislike') : undefined;
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
// @ts-ignore
const fetchPostLikeStatus = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () { return (yield PostLike.findOne({ where: { postId, userId } })); });
function likePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        return interactWithPost(userId, postId, true);
    });
}
exports.likePost = likePost;
function dislikePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        return interactWithPost(userId, postId, false);
    });
}
exports.dislikePost = dislikePost;
function interactWithPost(userId, postId, isLike) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const currentPostLike = yield PostLike.findOne({ where: { userId, postId } });
        if (currentPostLike) {
            if (currentPostLike.isLike === !isLike && (yield currentPostLike.update({ isLike })) != null) {
                return findPostLikesInfoByPk(postId);
            }
        }
        // @ts-ignore
        else if ((yield PostLike.create({ userId, postId, isLike })) != null)
            return findPostLikesInfoByPk(postId);
        return false;
    });
}
function removeLikeOrDislikeFromPost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const postLike = yield PostLike.findOne({ where: { userId, postId } });
        if ((yield postLike.destroy()) != null)
            return findPostLikesInfoByPk(postId);
        return false;
    });
}
exports.removeLikeOrDislikeFromPost = removeLikeOrDislikeFromPost;
function findPostLikesInfoByPk(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield Post.findByPk(postId, {
            attributes: ['id', 'likesCount', 'dislikesCount']
        })).dataValues;
    });
}
