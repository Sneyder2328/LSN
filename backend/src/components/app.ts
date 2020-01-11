import {Router} from "express";

import errorHandler from "../middlewares/errorHandler";
import undefRoutesHandler from "../middlewares/undefRoutesHandler";
import userRouter from "./user/user";
import postRouter from "./post/post";
import authRouter from "./auth/auth";
import commentRouter from "./comment/comment";

const router = Router();
router.use('/', userRouter);
router.use('/', postRouter);
router.use('/', authRouter);
router.use('/', commentRouter);

router.use('*', undefRoutesHandler);
router.use(errorHandler);

export default router;