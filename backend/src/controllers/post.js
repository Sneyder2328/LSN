const {Router} = require('express');
const {createPost, getPosts, likePost} = require('../services/post');
const authenticate = require('../middlewares/authenticate');
const {createPostValidationRules, likePostValidationRules, validate} = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const httpCodes = require('../utils/constants/httpResponseCodes');
const endpoints = require('../utils/constants/endpoints');

const router = Router();

router.post(endpoints.post.CREATE_POST, authenticate, createPostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const content = req.body;
    const post = await createPost(req.userId, content.type, content.text, content.img);
    res.status(httpCodes.CREATED).send(post);
}));

router.get(endpoints.post.GET_POSTS, handleErrorAsync(async (req, res) => {
    const posts = await getPosts();
    res.status(httpCodes.OK).send(posts);
}));

router.post(endpoints.post.LIKE_POST, authenticate, likePostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const postLiked = await likePost(req.userId, req.body.postId);
    res.status(httpCodes.OK).send(postLiked);
}));

module.exports = router;