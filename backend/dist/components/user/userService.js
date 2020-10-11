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
const UserNotFoundError_1 = require("../../utils/errors/UserNotFoundError");
const userRelationship_1 = __importDefault(require("../../utils/constants/userRelationship"));
const sequelize_1 = require("sequelize");
const constants_1 = require("../../utils/constants");
const postService_1 = require("../post/postService");
const { Post, Profile, UserRelationShip, PostImage, Comment } = database_1.models;
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
            user = user.toJSON();
            // user.posts = user.posts.sort(compareByDateAsc);
            user.posts = yield postService_1.processPosts(user.posts, currentUserId);
        }
        else {
            user = yield Profile.findOne({ where: { username } });
        }
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
            user = user.toJSON();
            // user.posts = user.posts.sort(compareByDateAsc);
            user.posts = yield postService_1.processPosts(user.posts, currentUserId);
        }
        else {
            user = yield Profile.findByPk(userId);
        }
        if (!user)
            throw new UserNotFoundError_1.UserNotFoundError();
        return user;
    });
}
exports.getProfileByUserId = getProfileByUserId;
function updateProfile(userId, { username, fullname, description, profilePhotoUrl, coverPhotoUrl }, imageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imageFile) {
            yield Profile.update({ username, fullname, description, profilePhotoUrl: imageFile.url }, { where: { userId } });
        }
        else {
            yield Profile.update({ username, fullname, description }, { where: { userId } });
        }
        return yield Profile.findByPk(userId);
    });
}
exports.updateProfile = updateProfile;
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
function sendFriendRequest(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fRequest = yield UserRelationShip.create({ senderId, receiverId, type: userRelationship_1.default.PENDING });
        return fRequest !== null;
    });
}
exports.sendFriendRequest = sendFriendRequest;
function getFriendRequests(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return UserRelationShip.findAll({ where: { receiverId: userId, type: userRelationship_1.default.PENDING } });
    });
}
exports.getFriendRequests = getFriendRequests;
function handleFriendRequest(receiverId, senderId, action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (action === 'confirm') {
            return UserRelationShip.update({ type: userRelationship_1.default.FRIEND }, { where: { receiverId, senderId } });
        }
        return UserRelationShip.destroy({ where: { receiverId, senderId } });
    });
}
exports.handleFriendRequest = handleFriendRequest;
