const {Router} = require('express');
const {getProfile, sendFriendRequest, getFriendRequest} = require('../services/user');
const {getProfileValidationRules, sendFriendRequestValidationRules, getFriendRequestValidationRules, validate} = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const authenticate = require('../middlewares/authenticate');
const endpoints = require('../utils/constants/endpoints');
const AuthError = require('../utils/errors/AuthError');
const httpCodes = require('../utils/constants/httpResponseCodes');
const router = Router();

router.get(endpoints.user.GET_PROFILE(':username'), getProfileValidationRules, validate, handleErrorAsync(async (req, res) => {
    const username = req.params.username;
    const user = await getProfile(username);
    res.json(user);
}));

router.post(endpoints.user.SEND_FRIEND_REQUEST, authenticate, sendFriendRequestValidationRules, validate, handleErrorAsync(async (req, res) => {
    if(req.body.senderId !== req.userId) throw new AuthError();
    const fRequestSent = await sendFriendRequest(req.body);
    res.status(httpCodes.CREATED).json(fRequestSent);
}));

router.get(endpoints.user.GET_FRIEND_REQUESTS(':userId'), authenticate, getFriendRequestValidationRules, validate, handleErrorAsync(async (req, res) => {
    if(req.params.userId !== req.userId) throw new AuthError();
    const friendRequests = await getFriendRequest(req.params.userId);
    res.json(friendRequests);
}));

module.exports = router;