const {Router} = require('express');
const {createPost, getPosts} = require('../services/post');
const authenticate = require('../middlewares/authenticate');
const {createPostValidationRules, validate} = require('../middlewares/validate');
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

module.exports = router;