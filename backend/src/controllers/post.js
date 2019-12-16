const {Router} = require('express');
const {createPost,getPosts} = require('../services/post');
const authenticate = require('../middlewares/authenticate');

const router = Router();

router.post('/createPost', authenticate, async (req, res) => {
    const content = req.body;
    const post = await createPost(req.userId, content.type, content.text, content.img);
    res.status(201).send(post);
});

router.get('/getPosts', async (req, res) => {
    const posts = await getPosts();
    res.status(200).send(posts);
});

module.exports = router;