const {Router} = require('express');

const errorHandler = require('../middlewares/errorHandler');
const undefRoutesHandler = require('../middlewares/undefRoutesHandler');
const userRouter = require('../controllers/user');
const postRouter = require('../controllers/post');
const authRouter = require('../controllers/auth');

const router = Router();
router.use('/', userRouter);
router.use('/', postRouter);
router.use('/', authRouter);

router.use('*', undefRoutesHandler);
router.use(errorHandler);

module.exports = router;