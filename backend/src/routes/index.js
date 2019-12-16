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