const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const {User} = require('../database/models/User');
const {Post} = require('../database/models/Post');
const {Profile} = require('../database/models/Profile');
const {Token} = require('../database/models/Token');
const bcrypt = require('bcryptjs');
const {authenticate, AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN, getJWTFromId} = require('../middleware/authenticate');

router.get('/profile/:username', async (req, res) => {
    const username = req.params.username; // sanitize
    try {
        console.log("Fetching ", username);
        const user = await Profile.findByPk(username);
        console.log("User:", JSON.stringify(user));
        res.json(user);
    } catch (e) {
        res.status(200).send(e);
    }
});

function genUUID() {
    let userId = [];
    uuid.v4(null, userId); // gen hex(uuid) for user,post,comment,etc
    return userId;
}

router.post('/signUp', async (req, res) => {
    try {
        let userId = genUUID();
        const password = await hashPassword(10, req.body.password);
        const user = await User.create({
            id: userId,
            username: req.body.username,
            typeLogin: req.body.typeLogin,
            email: req.body.email,
            password
        });
        await Profile.create({
            username: req.body.username,
            fullname: req.body.fullname,
            description: req.body.description,
            coverPhotoUrl: req.body.coverPhotoUrl,
            profilePhotoUrl: req.body.profilePhotoUrl
        });
        const accessToken = user.generateAccessToken();
        const refreshToken = uuid.v4();
        await Token.create({
            userId: userId,
            token: refreshToken
        });

        res.header(AUTH_ACCESS_TOKEN, accessToken)
            .header(AUTH_REFRESH_TOKEN, refreshToken)
            .send({access: true});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/logIn', async (req, res) => {
    const username = req.body.username; //needs satinize
    const password = req.body.password; //needs satinize

    // do validation

    const user = (await User.findAll({
        where: {username}
    }))[0];
    console.log("user =  ", user);
    if (!user) return res.status(401).send({status: 'Incorrect username'});
    bcrypt.compare(password, user.dataValues.password, async (err, success) => {
        if (err || !success)
            return res.status(401).send({status: 'Incorrect Password'});
        const accessToken = user.generateAccessToken();
        const refreshToken = uuid.v4();
        await Token.create({
            userId: user.dataValues.id,
            token: refreshToken
        });

        res.header(AUTH_ACCESS_TOKEN, accessToken)
            .header(AUTH_REFRESH_TOKEN, refreshToken)
            .send({access: true});
    });
});

router.get('/refreshToken', async (req, res) => {
    try {
        const refreshToken = req.header(AUTH_REFRESH_TOKEN); // need to satinize
        console.log(refreshToken);
        const token = await Token.findByPk(refreshToken);
        if (!token) return res.status(404).send({status: 'Refresh token not found'});
        console.log("token", token.dataValues);
        const bufferId = token.dataValues.userId;
        const userId = [...bufferId];
        console.log("token userId", userId);
        const accessToken = getJWTFromId(userId);
        res.header(AUTH_ACCESS_TOKEN, accessToken).send({status: 'New access token issued'});
    } catch (e) {
        console.log(e);
        res.status(401).send({status: 'Error generating new access token'});
    }
});

router.post('/createPost', authenticate, async (req, res) => {
    try {
        const post = await Post.create({
            id: genUUID(),
            userId: req.userId,
            type: req.body.type,
            text: req.body.text,
            img: req.body.img
        });
        res.send(post.dataValues);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

module.exports = router;

async function hashPassword(saltRounds = 10, password) {
    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) reject(err);
            resolve(hash)
        });
    });
}