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
const { Router } = require('express');
const { getProfile, sendFriendRequest, getFriendRequests, handleFriendRequest } = require('../services/user');
const { getProfileValidationRules, sendFriendRequestValidationRules, getFriendRequestValidationRules, acceptFriendRequestValidationRules, validate } = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const authenticate = require('../middlewares/authenticate');
const endpoints = require('../utils/constants/endpoints');
const httpCodes = require('../utils/constants/httpResponseCodes');
const router = Router();
router.get(endpoints.user.GET_PROFILE(':username'), getProfileValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const user = yield getProfile(username);
    res.json(user);
})));
router.post(endpoints.user.SEND_FRIEND_REQUEST(':receiverId'), authenticate, sendFriendRequestValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fRequestSent = yield sendFriendRequest(req.userId, req.params.receiverId);
    res.status(httpCodes.CREATED).json(fRequestSent);
})));
router.get(endpoints.user.GET_FRIEND_REQUESTS, authenticate, getFriendRequestValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const friendRequests = yield getFriendRequests(req.userId);
    res.json(friendRequests);
})));
router.put(endpoints.user.RESPOND_TO_FRIEND_REQUEST(':senderId'), authenticate, acceptFriendRequestValidationRules, validate, handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accepted = yield handleFriendRequest(req.userId, req.params.senderId, req.query.action);
    res.json(accepted);
})));
module.exports = router;
