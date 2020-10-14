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
const UserNotFoundError_1 = require("../../utils/errors/UserNotFoundError");
const sequelize_1 = require("sequelize");
const constants_1 = require("../../utils/constants");
const postService_1 = require("../post/postService");
const relationshipService_1 = require("./relationshipService");
const { Post, Profile, PostImage, Comment } = database_1.models;
const includePostsSorted = [
    {
        model: Post,
        as: 'posts',
        include: [
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
    }
];
function getProfileByUsername(username, includePosts, currentUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        if (includePosts) {
            user = yield Profile.findOne({ where: { username }, include: includePostsSorted });
            console.log('getProfileByUsername posts are', user.posts, user.posts.length);
            if (user.posts && user.posts.length !== 0) {
                user = user.toJSON();
                user.posts = yield postService_1.processPosts(user.posts, currentUserId);
            }
        }
        else {
            user = yield Profile.findOne({ where: { username } });
        }
        user.relationship = yield relationshipService_1.getRelationshipType(currentUserId, user.userId);
        if (!user)
            throw new UserNotFoundError_1.UserNotFoundError();
        return user;
    });
}
exports.getProfileByUsername = getProfileByUsername;
function getProfileByUserId(userId, includePosts, currentUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        if (includePosts) {
            user = yield Profile.findByPk(userId, { include: includePostsSorted });
            console.log('getProfileByUserId posts are', user.posts);
            if (user.posts && user.posts.length !== 0) {
                user = user.toJSON();
                user.posts = yield postService_1.processPosts(user.posts, currentUserId);
            }
        }
        else {
            user = yield Profile.findByPk(userId);
        }
        user.relationship = yield relationshipService_1.getRelationshipType(currentUserId, userId);
        if (!user)
            throw new UserNotFoundError_1.UserNotFoundError();
        return user;
    });
}
exports.getProfileByUserId = getProfileByUserId;
function updateProfile(userId, { username, fullname, description }, imageFiles) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const profilePhotoUrl = (_c = (_b = (_a = imageFiles) === null || _a === void 0 ? void 0 : _a.imageProfile) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.url;
        const coverPhotoUrl = (_f = (_e = (_d = imageFiles) === null || _d === void 0 ? void 0 : _d.imageCover) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.url;
        if (profilePhotoUrl && coverPhotoUrl) {
            yield Profile.update({ username, fullname, description, profilePhotoUrl, coverPhotoUrl }, { where: { userId } });
        }
        else if (profilePhotoUrl) {
            yield Profile.update({ username, fullname, description, profilePhotoUrl }, { where: { userId } });
        }
        else if (coverPhotoUrl) {
            yield Profile.update({ username, fullname, description, coverPhotoUrl }, { where: { userId } });
        }
        else {
            console.log('updating only', username, fullname, description);
            yield Profile.update({ username, fullname, description }, { where: { userId } });
        }
        return yield Profile.findByPk(userId);
    });
}
exports.updateProfile = updateProfile;
/**
 * Search users given the query matches the beginning of the full name
 * @param query (aka full name of the user looked for)
 */
function searchUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return Profile.findAll({
            attributes: ['userId', 'username', 'fullname', 'profilePhotoUrl'],
            where: {
                fullname: {
                    [sequelize_1.Op.like]: `${query}%`
                }
            }
        });
    });
}
exports.searchUser = searchUser;
