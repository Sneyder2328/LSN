const {Router} = require('express');
const {getProfile, sendFriendRequest, getFriendRequest, acceptFriendRequest} = require('../services/user');
const {getProfileValidationRules, sendFriendRequestValidationRules, getFriendRequestValidationRules, acceptFriendRequestValidationRules, validate} = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const authenticate = require('../middlewares/authenticate');
const endpoints = require('../utils/constants/endpoints');
const httpCodes = require('../utils/constants/httpResponseCodes');
const router = Router();

router.get(endpoints.user.GET_PROFILE(':username'), getProfileValidationRules, validate, handleErrorAsync(async (req, res) => {
    const username = req.params.username;
    const user = await getProfile(username);
    res.json(user);
}));

router.post(endpoints.user.SEND_FRIEND_REQUEST, authenticate, sendFriendRequestValidationRules, validate, handleErrorAsync(async (req, res) => {
    const fRequestSent = await sendFriendRequest(req.userId, req.body.receiverId);
    res.status(httpCodes.CREATED).json(fRequestSent);
}));

router.get(endpoints.user.GET_FRIEND_REQUESTS, authenticate, getFriendRequestValidationRules, validate, handleErrorAsync(async (req, res) => {
    const friendRequests = await getFriendRequest(req.userId);
    res.json(friendRequests);
}));

router.post(endpoints.user.ACCEPT_FRIEND_REQUEST, authenticate, acceptFriendRequestValidationRules, validate, handleErrorAsync(async (req, res) => {
    const accepted = await acceptFriendRequest(req.userId, req.body.senderId);
    res.json(accepted);
}));


module.exports = router;