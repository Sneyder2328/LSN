"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const express_validator_1 = require("express-validator");
const httpResponseCodes_1 = __importDefault(require("../utils/constants/httpResponseCodes"));
const trimInside = () => str => str.replace(/\s\s/g, ' ');
exports.signUpValidationRules = [
    express_validator_1.body('username').trim().escape()
        .isAlphanumeric().withMessage('Username can only contain alphanumeric characters(A-Z, 0-9)')
        .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    express_validator_1.body('fullname').customSanitizer(trimInside()).escape().isString()
        .isLength({ min: 5 }).withMessage('Full name must be at least 5 characters long'),
    express_validator_1.body('password').escape().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    express_validator_1.body('typeLogin').trim()
        .custom(val => val === 'email' || val === 'facebook' || val === 'google').withMessage('You must provide a valid type of login(email,facebook,google)'),
    express_validator_1.body('email').isEmail().normalizeEmail().withMessage('You must enter a valid email address'),
    express_validator_1.body('description').trim().isString().escape(),
    express_validator_1.body('coverPhotoUrl').trim().isString().escape(),
    express_validator_1.body('profilePhotoUrl').trim().isString().escape()
];
exports.logInValidationRules = [
    express_validator_1.body('username').trim().escape(),
    express_validator_1.body('password').escape()
];
exports.refreshTokenValidationRules = [
    express_validator_1.header(config_1.default.headers.refreshToken).trim().matches(config_1.default.regex.uuidV4).withMessage('Refresh token provided is not an uuidV4 token')
];
exports.getProfileValidationRules = [
    express_validator_1.param('userIdentifier').trim().escape().custom((value) => {
        return value.match(config_1.default.regex.uuidV4) || value.match("^[a-zA-Z0-9]+$");
    }).withMessage("userIdentifier provided is not alphanumeric nor uuidV4")
];
exports.updateProfileValidationRules = [
    express_validator_1.param('userId').trim().escape().custom((value) => value.match(config_1.default.regex.uuidV4))
        .withMessage("userId provided is not uuidV4"),
    express_validator_1.body('username').trim().escape()
        .isAlphanumeric().withMessage('Username can only contain alphanumeric characters(A-Z, 0-9)')
        .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    express_validator_1.body('fullname').customSanitizer(trimInside()).escape().isString()
        .isLength({ min: 5 }).withMessage('Full name must be at least 5 characters long'),
    express_validator_1.body('description').trim().isString().escape(),
    express_validator_1.body('coverPhotoUrl').trim().isString().escape(),
    express_validator_1.body('profilePhotoUrl').trim().isString().escape()
];
exports.searchUserValidationRules = [
    express_validator_1.query('query').isString().exists()
];
exports.sendFriendRequestValidationRules = [
    express_validator_1.param('receiverId').trim().matches(config_1.default.regex.uuidV4)
];
exports.deleteFriendshipValidationRules = [
    express_validator_1.param('otherUserId').trim().matches(config_1.default.regex.uuidV4)
];
const accessTokenIsValid = express_validator_1.header(config_1.default.headers.accessToken).trim().matches(config_1.default.regex.jwt).withMessage('Access token provided is not a valid JWT');
exports.getFriendRequestValidationRules = [
    accessTokenIsValid
];
exports.likePostValidationRules = [
    accessTokenIsValid,
    express_validator_1.param('postId').trim().matches(config_1.default.regex.uuidV4)
];
exports.likeCommentValidationRules = [
    accessTokenIsValid,
    express_validator_1.param('commentId').trim().matches(config_1.default.regex.uuidV4)
];
exports.getCommentsValidationRules = [
    express_validator_1.param('postId').trim().matches(config_1.default.regex.uuidV4),
    express_validator_1.query('offset').isDecimal().withMessage('offset must be a number'),
    express_validator_1.query('limit').isDecimal().withMessage('limit must be a number')
];
exports.createPostValidationRules = [
    express_validator_1.body('id').trim().matches(config_1.default.regex.uuidV4),
    express_validator_1.body('text').isString(),
    express_validator_1.body('img')
];
exports.acceptFriendRequestValidationRules = [
    express_validator_1.param('senderId').trim().matches(config_1.default.regex.uuidV4),
    express_validator_1.query('action').custom(val => val === 'confirm' || val === 'deny').withMessage('Action field must be either confirm or deny')
];
exports.createCommentValidationRules = [
    express_validator_1.body('type').custom(val => val === 'text' || val === 'img'),
    express_validator_1.param('postId').exists().escape(),
    express_validator_1.body('id').exists().escape(),
    express_validator_1.body('text').not().isEmpty().trim().escape(),
    express_validator_1.body('img').escape()
];
function validate(req, res, next) {
    const errors = express_validator_1.validationResult(req);
    if (errors.isEmpty())
        return next();
    const extractedErrors = [];
    // @ts-ignore
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(httpResponseCodes_1.default.UNPROCESSABLE_ENTITY).json({
        errors: extractedErrors,
    });
}
exports.validate = validate;
