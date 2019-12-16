const {Router} = require('express');

const errorHandler = require('../middlewares/errorHandler');
const AppError = require('../utils/AppError');
const userRouter = require('../controllers/user');
const postRouter = require('../controllers/post');
const authRouter = require('../controllers/auth');

const router = Router();
router.use('/', userRouter);
router.use('/', postRouter);
router.use('/', authRouter);

// handle undefined Routes
router.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});
router.use(errorHandler);

module.exports = router;
/*
router.get('/profile/:username', async (req, res) => {
    const username = req.params.username; // sanitize
    try {
        console.log("Fetching ", username);
        const user = await Profile.findOne({where: {username}});
        console.log("User:", JSON.stringify(user));
        res.json(user);
    } catch (e) {
        res.status(200).send(e);
    }
});
*/
/*
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
            userId,
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
*/

/*
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
*/

/*
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
        const accessToken = signJWT(userId);
        res.header(AUTH_ACCESS_TOKEN, accessToken).send({status: 'New access token issued'});
    } catch (e) {
        console.log(e);
        res.status(401).send({status: 'Error generating new access token'});
    }
});
 */
/*
router.post('/createPost', authenticate, async (req, res) => {
    try {
        const post = await Post.create({
            id: genUUID(),
            userId: req.userId,
            type: req.body.type,
            text: req.body.text,
            img: req.body.img
        });
        res.status(201).send(post.dataValues);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.get('/getPosts', async (req, res) => {
    try {
        const posts = await Post.findAll({include: [Profile]});
        if (!posts) res.status(200).send([]);
        res.status(200).send(posts.map(post => post.dataValues));
    } catch (e) {
        console.log(e);
        res.status(400).send({status: "Error fetching posts"})
    }
});
 */


