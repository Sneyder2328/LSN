const {Router} = require('express');
const {createComment, likeComment} = require('../services/comment');
const authenticate = require('../middlewares/authenticate');
const {createCommentValidationRules, likeCommentValidationRules, validate} = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const httpCodes = require('../utils/constants/httpResponseCodes');
const endpoints = require('../utils/constants/endpoints');

const router = Router();

router.post(endpoints.comment.CREATE_COMMENT, authenticate, createCommentValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await createComment(req.userId, req.body);
    res.status(httpCodes.CREATED).send(response);
}));

router.post(endpoints.comment.LIKE_COMMENT, authenticate, likeCommentValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await likeComment(req.userId, req.body.commentId);
    res.status(httpCodes.OK).send(response);
}));

module.exports = router;