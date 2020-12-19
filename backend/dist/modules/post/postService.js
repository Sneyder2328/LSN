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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database/database");
const constants_1 = require("../../utils/constants");
const utils_1 = require("../../utils/utils");
const PostNotCreatedError_1 = require("../../utils/errors/PostNotCreatedError");
const commentService_1 = require("../comment/commentService");
const AppError_1 = require("../../utils/errors/AppError");
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const notificationService_1 = require("../notification/notificationService");
const postEmitter_1 = require("./postEmitter");
const { Comment, Post, PostLike, Profile, PostImage } = database_1.models;
function createPost(postId, userId, type, text, images) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield Post.create({ id: postId, userId, type, text });
        if (!post)
            throw new PostNotCreatedError_1.PostNotCreatedError();
        postEmitter_1.postEmitter.emit(postEmitter_1.POST_CREATED, { postId, text });
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
exports.addLikeStatusToPosts = (posts, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const postLikeStatusList = (yield Promise.all(posts.map(post => fetchPostLikeStatus(post.id, userId)))).filter(it => it != null);
    // console.log('postLikeStatusList', postLikeStatusList);
    const commentLikeStatusList = (yield Promise.all(posts.map(post => post.comments.map(comment => comment.id))
        .filter(it => it.lenght !== 0)
        .flat()
        .map(commentId => commentService_1.fetchCommentLikeStatus(commentId, userId)))).filter(it => it != null);
    // console.log('commentLikeStatusList', commentLikeStatusList);
    posts = posts.map(post => {
        const postLikeStatus = postLikeStatusList.find((postLike) => postLike.postId === post.id);
        return Object.assign(Object.assign({}, post), { likeStatus: postLikeStatus != null ? (postLikeStatus.isLike === true ? 'like' : 'dislike') : undefined, comments: post.comments.map(comment => {
                const commentLikeStatus = commentLikeStatusList.find((commentLike) => commentLike.commentId === comment.id);
                comment.likeStatus = commentLikeStatus != null ? (commentLikeStatus.isLike === true ? 'like' : 'dislike') : undefined;
                comment.authorProfile = comment.Profile;
                delete comment.Profile;
                return comment;
            }).sort(utils_1.compareByDateDesc) });
    }).sort(utils_1.compareByDateAsc);
    return posts;
});
const LIMIT_INITIAL_COMMENTS_PER_POST = 3;
function getPostsBySection(currentUserId, section, limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getPostsBySection', currentUserId, section, limit, offset);
        let posts = yield database_1.sequelize.query(`
    SELECT P.id,
       P.userId,
       likesCount,
       commentsCount,
       P.createdAt,
       text,
       dislikesCount,
       Pr.userId          as 'author.userId',
       Pr.username        as 'author.username',
       Pr.fullname        as 'author.fullname',
       Pr.coverPhotoUrl   as 'author.coverPhotoUrl',
       Pr.profilePhotoUrl as 'author.profilePhotoUrl',
       Pr.description     as 'author.description'
FROM Post P
         JOIN Profile Pr ON P.userId = Pr.userId
` + (offset ? ` WHERE P.createdAt < '${offset}' ` : ``) +
            `ORDER BY P.createdAt DESC LIMIT ${limit}`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        // @ts-ignore
        posts = yield processPosts(posts, currentUserId);
        return posts;
    });
}
exports.getPostsBySection = getPostsBySection;
function getPostsByHashtag(currentUserId, hashtag, limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getPostsByHashtag', hashtag, limit, offset);
        let posts = yield database_1.sequelize.query(`
    SELECT P.id,
       P.userId,
       likesCount,
       commentsCount,
       P.createdAt,
       text,
       dislikesCount,
       Pr.userId   as 'author.userId',
       Pr.username as 'author.username',
       Pr.fullname as 'author.fullname',
       Pr.username as 'author.coverPhotoUrl',
       Pr.profilePhotoUrl as 'author.profilePhotoUrl',
       Pr.description as 'author.description'
FROM Post P
         JOIN Profile Pr ON P.userId = Pr.userId
         JOIN Hashtag_Post HP on P.id = HP.postId
         JOIN Hashtag H on HP.hashtagId = H.id
WHERE H.name = '${hashtag}'` + (offset ? ` AND P.createdAt < '${offset}'` : ``) + ` LIMIT ${limit}`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        // @ts-ignore
        posts = yield processPosts(posts, currentUserId);
        return posts;
    });
}
exports.getPostsByHashtag = getPostsByHashtag;
function processPosts(posts, currentUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(posts.map((_a) => __awaiter(this, void 0, void 0, function* () {
            var { id, userId, likesCount, commentsCount, createdAt, text, dislikesCount } = _a, author = __rest(_a, ["id", "userId", "likesCount", "commentsCount", "createdAt", "text", "dislikesCount"]);
            return {
                id, userId, likesCount, commentsCount, createdAt, text, dislikesCount,
                authorProfile: {
                    userId: author['author.userId'],
                    username: author['author.username'],
                    fullname: author['author.fullname'],
                    coverPhotoUrl: author['author.coverPhotoUrl'],
                    profilePhotoUrl: author['author.profilePhotoUrl'],
                    description: author['author.description'],
                },
                images: yield getImagesByPost(id),
                comments: yield commentService_1.getComments2(currentUserId, id, LIMIT_INITIAL_COMMENTS_PER_POST),
                likeStatus: yield getLikeStatusForPost(id, currentUserId)
            };
        })));
    });
}
function getImagesByPost(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const images = yield database_1.sequelize.query(`SELECT id, url
    FROM Post_Image
    WHERE postId = '${postId}'`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        return images;
    });
}
function getLikeStatusForPost(postId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const postLikeStatus = yield fetchPostLikeStatus(postId, userId);
        return postLikeStatus != null ? (postLikeStatus.isLike === true ? 'like' : 'dislike') : undefined;
    });
}
function getPost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        let post = yield Post.findByPk(postId, {
            include: [
                {
                    model: Profile,
                    as: 'authorProfile'
                },
                {
                    model: PostImage,
                    as: 'images',
                    attributes: ['url', 'id']
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
        if (!post)
            throw new AppError_1.AppError(httpResponseCodes_1.default.NOT_FOUND, 'Not found', 'Post not found');
        post = post.toJSON();
        post = yield exports.addLikeStatusToPosts([post], userId);
        if (!post[0])
            return {};
        return post[0];
    });
}
exports.getPost = getPost;
function getPostPreview(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        let post = yield Post.findByPk(postId);
        if (!post)
            throw new AppError_1.AppError(httpResponseCodes_1.default.NOT_FOUND, 'Not found', 'Post not found');
        return post;
    });
}
exports.getPostPreview = getPostPreview;
function getPostFromPhoto(userId, photoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const postImage = yield PostImage.findByPk(photoId);
        if (!postImage)
            throw new AppError_1.AppError(httpResponseCodes_1.default.NOT_FOUND, 'Not found', 'photo not found');
        return getPost(userId, postImage.postId);
    });
}
exports.getPostFromPhoto = getPostFromPhoto;
function getPostAuthorId(postId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield database_1.sequelize.query(`SELECT U.userId as userId
FROM Post P
         JOIN Profile U ON P.userId = U.userId
WHERE P.id = '${postId}'`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        // @ts-ignore
        return (_a = result[0]) === null || _a === void 0 ? void 0 : _a.userId;
    });
}
exports.getPostAuthorId = getPostAuthorId;
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
        const postAuthorId = yield getPostAuthorId(postId);
        notificationService_1.generateNotification(postId, postAuthorId, userId, notificationService_1.ActivityType.POST_LIKED, postId);
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
        return yield Post.findByPk(postId, {
            attributes: ['id', 'likesCount', 'dislikesCount']
        });
    });
}
function getTrendingHashtags() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashtags = yield database_1.sequelize.query(`
SELECT COUNT(*) as count, name
FROM Hashtag H
         JOIN Hashtag_POST HP ON H.id = HP.hashtagId
         JOIN Post P ON P.id = HP.postId
WHERE P.createdAt >= CURRENT_DATE()
GROUP BY name
ORDER BY COUNT(*) DESC
LIMIT 7;`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        return hashtags;
    });
}
exports.getTrendingHashtags = getTrendingHashtags;
function getHashtag(hashtag) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const hashtags = yield database_1.sequelize.query(`
SELECT id as hashtagId FROM Hashtag 
WHERE name = '${hashtag}'  
LIMIT 1
`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        return (_b = (_a = hashtags) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.hashtagId;
    });
}
exports.getHashtag = getHashtag;
function saveHashtag(id, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultInsert = yield database_1.sequelize.query(`
INSERT INTO Hashtag(id, name) 
VALUES('${id}', '${name}')`);
    });
}
exports.saveHashtag = saveHashtag;
function saveHashtagPost(hashtagId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultInsert = yield database_1.sequelize.query(`
INSERT INTO Hashtag_Post(hashtagId, postId) 
VALUES('${hashtagId}', '${postId}')`);
    });
}
exports.saveHashtagPost = saveHashtagPost;
