const {Router} = require('express');
const {getProfile} = require('../services/user');
const {getProfileValidationRules, validate} = require('../middlewares/validate');
const handleErrorAsync = require('../middlewares/handleErrorAsync');

const router = Router();

router.get('/profile/:username', getProfileValidationRules, validate, handleErrorAsync(async (req, res) => {
    const username = req.params.username;
    const user = await getProfile(username);
    res.json(user);
}));

module.exports = router;