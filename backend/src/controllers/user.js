const {Router} = require('express');
const {getProfile} = require('../services/user');

const router = Router();

router.get('/profile/:username', async (req, res) => {
    const username = req.params.username; // validate, if not valid throw some validation error
    const user = await getProfile(username);
    res.json(user);
});

module.exports = router;