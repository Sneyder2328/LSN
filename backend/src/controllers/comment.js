const {Router} = require('express');
const {createComment, likeComment, dislikeComment, removeLikeOrDislikeComment, getComments} = require('../services/comment');
const authenticate = require('../middlewares/authenticate');
const {createCommentValidationRules, likeCommentValidationRules, getCommentsValidationRules, validate} = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const httpCodes = require('../utils/constants/httpResponseCodes');
const endpoints = require('../utils/constants/endpoints');

const router = Router();

router.post(endpoints.comment.CREATE_COMMENT(':postId'), authenticate, createCommentValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await createComment(req.userId, req.params.postId, req.body);
    res.status(httpCodes.CREATED).send(response);
}));

router.post(endpoints.comment.LIKE_COMMENT(':commentId'), authenticate, likeCommentValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await likeComment(req.userId, req.params.commentId);
    res.status(httpCodes.OK).send(response);
}));

router.delete(endpoints.comment.LIKE_COMMENT(':commentId'), authenticate, likeCommentValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await removeLikeOrDislikeComment(req.userId, req.params.commentId);
    res.status(httpCodes.OK).send(response);
}));

router.post(endpoints.comment.DISLIKE_COMMENT(':commentId'), authenticate, likeCommentValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await dislikeComment(req.userId, req.params.commentId);
    res.status(httpCodes.OK).send(response);
}));

router.delete(endpoints.comment.DISLIKE_COMMENT(':commentId'), authenticate, likeCommentValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await removeLikeOrDislikeComment(req.userId, req.params.commentId);
    res.status(httpCodes.OK).send(response);
}));

router.get(endpoints.comment.GET_COMMENTS(':postId'), authenticate, getCommentsValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await getComments(req.params.postId, req.query.offset, req.query.limit);
    res.status(httpCodes.OK).send(response);
}));

module.exports = router;