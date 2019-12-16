const {Router} = require('express');
const {getProfile} = require('../services/user');
const {getProfileValidationRules, validate} = require('../middlewares/validate');

const router = Router();

router.get('/profile/:username', getProfileValidationRules, validate, async (req, res) => {
    const username = req.params.username;
    const user = await getProfile(username);
    res.json(user);
});

module.exports = router;