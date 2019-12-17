const {Router} = require('express');
const {createPost, getPosts} = require('../services/post');
const authenticate = require('../middlewares/authenticate');
const {createPostValidationRules, validate} = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');

const router = Router();

router.post('/createPost', authenticate, createPostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const content = req.body;
    const post = await createPost(req.userId, content.type, content.text, content.img);
    res.status(201).send(post);
}));

router.get('/getPosts', handleErrorAsync(async (req, res) => {
    const posts = await getPosts();
    res.status(200).send(posts);
}));

module.exports = router;