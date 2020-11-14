import {Router} from "express";
import {
    getProfileByUserId,
    getProfileByUsername,
    searchUser,
    updateProfile
} from "./userService";
import {
    acceptFriendRequestValidationRules,
    deleteFriendshipValidationRules,
    getFriendRequestValidationRules,
    getFriendsByUserValidationRules,
    getProfileValidationRules,
    paramUserIdValidationRules,
    removeUserSuggestionValidationRules,
    searchUserValidationRules,
    sendFriendRequestValidationRules,
    updateProfileValidationRules,
    validate
} from "../../middlewares/validate";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import authenticate from "../../middlewares/authenticate";
import endpoints from "../../utils/constants/endpoints";
import httpCodes from "../../utils/constants/httpResponseCodes";
import config from "../../config/config";
import multer from "multer";
import {MAX_IMG_FILE_SIZE} from "../../utils/constants";
import {cloudinary} from "../../config/cloudinaryConfig";
import cloudinaryStorage from "multer-storage-cloudinary";
import {
    deleteFriendship,
    getCurrentFriends,
    getFriendRequests, getUserSuggestions,
    handleFriendRequest, removeUserSuggestion,
    sendFriendRequest
} from "./relationshipService";
import {verifyParamIdMatchesLoggedUser} from "../../middlewares/verifyParamId";

const storage = cloudinaryStorage({
    cloudinary,
    folder: 'usersImages',
    allowedFormats: ['jpg', 'png', "jpeg"],
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    },
    transformation: [{width: 960, height: 960, crop: 'limit'}]
});
const parser = multer({
    storage,
    limits: {fileSize: MAX_IMG_FILE_SIZE}
});
const imageUpload = parser.fields([
    {name: 'imageProfile', maxCount: 1},
    {name: 'imageCover', maxCount: 1}
]);

const router = Router();

/**
 * Get user's profile basic data
 */
router.get(endpoints.user.USERS(':userIdentifier'), authenticate, getProfileValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const userIdentifier: string = req.params.userIdentifier;
        const includePosts = req.query.includePosts == "true";
        const user = userIdentifier.match(config.regex.uuidV4) ? await getProfileByUserId(userIdentifier, includePosts, req.userId) : await getProfileByUsername(userIdentifier, includePosts, req.userId);
        res.json(user);
    }));


/**
 * Update current logged in user's profile basic data
 */
router.put(endpoints.user.UPDATE_PROFILE(':userId'), authenticate, verifyParamIdMatchesLoggedUser('userId'),
    imageUpload, updateProfileValidationRules, validate, handleErrorAsync(async (req, res) => {
        const user = await updateProfile(req.userId, req.body, req.files)
        res.json(user);
    }));

/**
 * Search for users whose full name matches a given query
 */
router.get(endpoints.user.SEARCH, authenticate, searchUserValidationRules, validate, handleErrorAsync(async (req, res) => {
    const query = req.query.query;
    if (query.length < 2) return res.send([]);
    const users = await searchUser(query);
    res.json(users);
}));

/**
 * Send a friend request to another user (receiverId)
 */
router.post(endpoints.user.FRIENDS(':receiverId'), authenticate, sendFriendRequestValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const fRequestSent = await sendFriendRequest(req.userId, req.params.receiverId);
        res.status(httpCodes.CREATED).send(fRequestSent);
    }));

/**
 * Respond to friend request received from another user (senderId)
 */
router.put(endpoints.user.RESPOND_TO_FRIEND_REQUEST(':senderId'), authenticate, acceptFriendRequestValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const response = await handleFriendRequest(req.userId, req.params.senderId, req.query.action);
        res.json(response);
    }));

/**
 * Remove a friendship(either pending or current) with another user
 */
router.delete(endpoints.user.FRIENDS(':otherUserId'), authenticate, deleteFriendshipValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const deleted = await deleteFriendship(req.userId, req.params.otherUserId);
        res.status(httpCodes.OK).send(deleted);
    }));

/**
 * Get all friend requests received by current logged in user
 */
router.get(endpoints.user.GET_FRIEND_REQUESTS, authenticate, getFriendRequestValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const friendRequests = await getFriendRequests(req.userId);
        res.json(friendRequests);
    }));

/**
 * Get all current friends of a given user
 */
router.get(endpoints.USERS_USER_ID_FRIENDS(':userId'), authenticate, getFriendsByUserValidationRules, validate,
     handleErrorAsync(async (req, res) => {
        const friends = await getCurrentFriends(req.params.userId);
        res.json(friends);
    }))

/**
 * Get active users suggestions of the user
 */
router.get('/suggestions/:userId', authenticate, paramUserIdValidationRules, validate,
    verifyParamIdMatchesLoggedUser('userId'), handleErrorAsync(async (req, res) => {
        const usersSuggestions = await getUserSuggestions(req.userId)
        res.json(usersSuggestions)
    }))

/**
 * Delete an user suggestion from the logged user's suggestions
 */
router.delete('/suggestions/:suggestedUserId', authenticate, removeUserSuggestionValidationRules, validate,
    handleErrorAsync(async (req, res) => {
        const updated = await removeUserSuggestion(req.userId, req.params.suggestedUserId)
        res.status(httpCodes.OK).send(updated)
    }))

export default router;