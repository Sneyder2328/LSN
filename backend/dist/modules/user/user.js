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
const userService_1 = require("./userService");
const validate_1 = require("../../middlewares/validate");
const handleErrorAsync_1 = require("../../middlewares/handleErrorAsync");
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const endpoints_1 = __importDefault(require("../../utils/constants/endpoints"));
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const config_1 = __importDefault(require("../../config/config"));
const multer_1 = __importDefault(require("multer"));
const constants_1 = require("../../utils/constants");
const cloudinaryConfig_1 = require("../../config/cloudinaryConfig");
const multer_storage_cloudinary_1 = __importDefault(require("multer-storage-cloudinary"));
const relationshipService_1 = require("./relationshipService");
const storage = multer_storage_cloudinary_1.default({
    cloudinary: cloudinaryConfig_1.cloudinary,
    folder: 'usersImages',
    allowedFormats: ['jpg', 'png', "jpeg"],
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
    transformation: [{ width: 960, height: 960, crop: 'limit' }]
});
const parser = multer_1.default({
    storage,
    limits: { fileSize: constants_1.MAX_IMG_FILE_SIZE }
});
const imageUpload = parser.fields([
    { name: 'imageProfile', maxCount: 1 },
    { name: 'imageCover', maxCount: 1 }
]);
const router = express_1.Router();
/**
 * Get user's profile basic data
 */
router.get(endpoints_1.default.user.GET_PROFILE(':userIdentifier'), authenticate_1.default, validate_1.getProfileValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdentifier = req.params.userIdentifier;
    const includePosts = req.query.includePosts == "true";
    const user = userIdentifier.match(config_1.default.regex.uuidV4) ? yield userService_1.getProfileByUserId(userIdentifier, includePosts, req.userId) : yield userService_1.getProfileByUsername(userIdentifier, includePosts, req.userId);
    res.json(user);
})));
/**
 * Update current logged in user's profile basic data
 */
router.put(endpoints_1.default.user.UPDATE_PROFILE(':userId'), authenticate_1.default, imageUpload, validate_1.updateProfileValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (req.userId !== userId) {
        res.status(httpResponseCodes_1.default.FORBIDDEN).send({ error: "You cannot edit someone else's profile" });
    }
    else {
        const user = yield userService_1.updateProfile(userId, req.body, req.files);
        res.json(user);
    }
})));
/**
 * Search for users whose full name matches a given query
 */
router.get(endpoints_1.default.user.SEARCH, authenticate_1.default, validate_1.searchUserValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    if (query.length < 2)
        return res.send([]);
    const users = yield userService_1.searchUser(query);
    res.json(users);
})));
/**
 * Send a friend request to another user (receiverId)
 */
router.post(endpoints_1.default.user.SEND_FRIEND_REQUEST(':receiverId'), authenticate_1.default, validate_1.sendFriendRequestValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fRequestSent = yield relationshipService_1.sendFriendRequest(req.userId, req.params.receiverId);
    res.status(httpResponseCodes_1.default.CREATED).send(fRequestSent);
})));
/**
 * Get all friend requests received by current logged in user
 */
router.get(endpoints_1.default.user.GET_FRIEND_REQUESTS, authenticate_1.default, validate_1.getFriendRequestValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const friendRequests = yield relationshipService_1.getFriendRequests(req.userId);
    res.json(friendRequests);
})));
/**
 * Respond to friend request received from another user (senderId)
 */
router.put(endpoints_1.default.user.RESPOND_TO_FRIEND_REQUEST(':senderId'), authenticate_1.default, validate_1.acceptFriendRequestValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accepted = yield relationshipService_1.handleFriendRequest(req.userId, req.params.senderId, req.query.action);
    res.json(accepted);
})));
exports.default = router;
