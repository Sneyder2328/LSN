import {Router} from "express";
import {
    getFriendRequests,
    getProfileByUserId,
    getProfileByUsername,
    handleFriendRequest,
    searchUser,
    sendFriendRequest, updateProfile
} from "./userService";
import {
    acceptFriendRequestValidationRules,
    getFriendRequestValidationRules,
    getProfileValidationRules, searchUserValidationRules,
    sendFriendRequestValidationRules, updateProfileValidationRules, validate
} from "../../middlewares/validate";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import authenticate from "../../middlewares/authenticate";
import endpoints from "../../utils/constants/endpoints";
import httpCodes from "../../utils/constants/httpResponseCodes";
import config from "../../config/config";
import multer from "multer";
import {MAX_IMG_FILE_SIZE, MAX_IMGS_PER_UPLOAD} from "../../utils/constants";
import {cloudinary} from "../../config/cloudinaryConfig";
import cloudinaryStorage from "multer-storage-cloudinary";

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
// const imageUpload = parser.single('imageProfile');

const router = Router();

router.get(endpoints.user.GET_PROFILE(':userIdentifier'), authenticate, getProfileValidationRules, validate, handleErrorAsync(async (req, res) => {
    const userIdentifier: string = req.params.userIdentifier;
    const includePosts = req.query.includePosts == "true";
    const user = userIdentifier.match(config.regex.uuidV4) ? await getProfileByUserId(userIdentifier, includePosts, req.userId) : await getProfileByUsername(userIdentifier, includePosts, req.userId);
    res.json(user);
}));

router.put(endpoints.user.UPDATE_PROFILE(':userId'), authenticate, imageUpload, updateProfileValidationRules, validate, handleErrorAsync(async (req, res) => {
    const userId: string = req.params.userId;
    if (req.userId !== userId) {
        res.status(httpCodes.FORBIDDEN).send({error: "You cannot edit someone else's profile"});
    } else {
        const user = await updateProfile(userId, req.body, req.files)
        // const user = await updateProfile(userId, req.body)
        res.json(user);
    }
}));

router.get(endpoints.user.SEARCH, authenticate, searchUserValidationRules, validate, handleErrorAsync(async (req, res) => {
    const query = req.query.query;
    if (query.length < 2) return res.send([]);
    const users = await searchUser(query);
    res.json(users);
}));

router.post(endpoints.user.SEND_FRIEND_REQUEST(':receiverId'), authenticate, sendFriendRequestValidationRules, validate, handleErrorAsync(async (req, res) => {
    const fRequestSent = await sendFriendRequest(req.userId, req.params.receiverId);
    res.status(httpCodes.CREATED).send(fRequestSent);
}));

router.get(endpoints.user.GET_FRIEND_REQUESTS, authenticate, getFriendRequestValidationRules, validate, handleErrorAsync(async (req, res) => {
    const friendRequests = await getFriendRequests(req.userId);
    res.json(friendRequests);
}));

router.put(endpoints.user.RESPOND_TO_FRIEND_REQUEST(':senderId'), authenticate, acceptFriendRequestValidationRules, validate, handleErrorAsync(async (req, res) => {
    const accepted = await handleFriendRequest(req.userId, req.params.senderId, req.query.action);
    res.json(accepted);
}));

export default router;