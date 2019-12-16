const {Router} = require('express');
const {createPost, getPosts} = require('../services/post');
const authenticate = require('../middlewares/authenticate');
const {createPostValidationRules, validate} = require('../middlewares/validate');

const router = Router();

router.post('/createPost', authenticate, createPostValidationRules, validate, async (req, res) => {
    const content = req.body;
    const post = await createPost(req.userId, content.type, content.text, content.img);
    res.status(201).send(post);
});

router.get('/getPosts', async (req, res) => {
    const posts = await getPosts();
    res.status(200).send(posts);
});

module.exports = router;