import {Router} from "express";
import authenticate from "../../middlewares/authenticate";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import httpCodes from "../../utils/constants/httpResponseCodes";
import {getNotifications} from "./notificationService";

const router = Router()

router.get('/notifications/', authenticate,
    handleErrorAsync(async (req, res) => {
        const notifications = await getNotifications(req.userId)
        res.status(httpCodes.OK).send(notifications)
    }))

export {router as notificationsRouter}