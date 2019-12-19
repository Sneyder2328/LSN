const AppError = require('../utils/errors/AppError');
const {body, header, param, validationResult} = require('express-validator');
const {config} = require('../config/config');

const signUpValidationRules = [
    body('username').isAlphanumeric().isLength({min: 4}).escape(),
    body('fullname').isString().isLength({min: 4}).escape(),
    body('password').isLength({min: 8}).escape(),
    body('typeLogin').isString().isLength({min: 4}),
    body('email').isEmail(),
    body('description').isString().escape(),
    body('coverPhotoUrl').isString().escape(),
    body('profilePhotoUrl').isString().escape()
];

const logInValidationRules = [
    body('username').isAlphanumeric().isLength({min: 4}).escape(),
    body('password').isLength({min: 8}).escape()
];

const refreshTokenValidationRules = [
    header(config.headers.refreshToken).isString().exists()
];

const getProfileValidationRules = [
    param('username').isAlphanumeric().exists()
];

const sendFriendRequestValidationRules = [
    body('senderId').exists(),
    body('receiverId').exists()
];

const accessTokenIsValid = header(config.headers.accessToken).isString().exists();

const getFriendRequestValidationRules = [
    accessTokenIsValid
];

const likePostValidationRules = [
    accessTokenIsValid
];

const likeCommentValidationRules = [
    accessTokenIsValid,
    body('commentId').exists()
];

const createPostValidationRules = [
    body('type').isString().escape(),
    body('text').isLength({min: 1}).escape(),
    body('img').escape()
];

const acceptFriendRequestValidationRules = [
    body('senderId').exists().escape()
];

const createCommentValidationRules = [
    body('type').isString().escape(),
    body('postId').exists().escape(),
    body('id').exists().escape(),
    body('text').isLength({min: 1}).escape(),
    body('img').escape()
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));
    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    createPostValidationRules,
    signUpValidationRules,
    logInValidationRules,
    refreshTokenValidationRules,
    getProfileValidationRules,
    sendFriendRequestValidationRules,
    getFriendRequestValidationRules,
    acceptFriendRequestValidationRules,
    likePostValidationRules,
    createCommentValidationRules,
    likeCommentValidationRules,
    validate
};