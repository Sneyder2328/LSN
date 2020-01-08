const httpCodes = require('../utils/constants/httpResponseCodes');
const {body, header, param, validationResult, query} = require('express-validator');
const {config} = require('../config/config');

function trimInside() {
    return str => str.replace(/\s\s/g, ' ');
}

const signUpValidationRules = [
    body('username').trim().escape()
        .isAlphanumeric().withMessage('Username can only contain alphanumeric characters(A-Z, 0-9)')
        .isLength({min: 5}).withMessage('Username must be at least 5 characters long'),
    body('fullname').customSanitizer(trimInside()).escape().isString()
        .isLength({min: 5}).withMessage('Full name must be at least 5 characters long'),
    body('password').escape().isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('typeLogin').trim()
        .custom(val => val === 'email' || val === 'facebook' || val === 'google').withMessage('You must provide a valid type of login(email,facebook,google)'),
    body('email').isEmail().normalizeEmail().withMessage('You must enter a valid email address'),
    body('description').trim().isString().escape(),
    body('coverPhotoUrl').trim().isString().escape(),
    body('profilePhotoUrl').trim().isString().escape()
];

const logInValidationRules = [
    body('username').trim().escape(),
    body('password').escape()
];

const refreshTokenValidationRules = [
    header(config.headers.refreshToken).trim().matches(config.regex.uuidV4).withMessage('Refresh token provided is not an uuidV4 token')
];

const getProfileValidationRules = [
    param('username').trim().escape().isAlphanumeric()
];

const sendFriendRequestValidationRules = [
    param('receiverId').trim().matches(config.regex.uuidV4)
];

const accessTokenIsValid = header(config.headers.accessToken).trim().matches(config.regex.jwt).withMessage('Access token provided is not a valid JWT');

const getFriendRequestValidationRules = [
    accessTokenIsValid
];

const likePostValidationRules = [
    accessTokenIsValid,
    param('postId').trim().matches(config.regex.uuidV4)
];

const likeCommentValidationRules = [
    accessTokenIsValid,
    param('commentId').trim().matches(config.regex.uuidV4)
];

const getCommentsValidationRules = [
    param('postId').trim().matches(config.regex.uuidV4),
    query('offset').isDecimal().withMessage('offset must be a number'),
    query('limit').isDecimal().withMessage('limit must be a number')
];

const createPostValidationRules = [
    body('type').isString().escape(),
    body('text').not().isEmpty().trim().escape(),
    body('img').escape()
];

const acceptFriendRequestValidationRules = [
    param('senderId').trim().matches(config.regex.uuidV4),
    query('action').custom(val => val === 'confirm' || val === 'deny').withMessage('Action field must be either confirm or deny')
];

const createCommentValidationRules = [
    body('type').custom(val => val === 'text' || val === 'img'),
    param('postId').exists().escape(),
    body('id').exists().escape(),
    body('text').not().isEmpty().trim().escape(),
    body('img').escape()
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));
    return res.status(httpCodes.UNPROCESSABLE_ENTITY).json({
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
    getCommentsValidationRules,
    validate
};