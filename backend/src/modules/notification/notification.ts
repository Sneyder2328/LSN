import { Router } from "express";
import authenticate from "../../middlewares/authenticate";
import { handleErrorAsync } from "../../middlewares/handleErrorAsync";
import httpCodes from "../../utils/constants/httpResponseCodes";
import { ackIncomingNotifications, getNotifications, getUnseenNotfsCount, markAllNotfsAsRead, updateNotfStatus } from "./notificationService";

const router = Router()

/**
 * Get incoming notifications by current user
 */
router.get('/notifications/', authenticate,
    handleErrorAsync(async (req, res) => {
        const notifications = await getNotifications(req.userId)
        const unseenCount = await getUnseenNotfsCount(req.userId)
        res.status(httpCodes.OK).send({notifications, unseenCount})
    }))

/**
 * Update status for incoming notification to current user by its id
 * status: 'ack'|'read'|'sent'
 */
router.put(`/notifications/:notificationId`, authenticate,
    handleErrorAsync(async (req, res) => {
        const updated = await updateNotfStatus(req.userId, req.params.notificationId, req.body.status)
        res.status(httpCodes.OK).send(updated)
    }))

/**
 * Mark incoming notifications to current user as either acknowledged or read
 * status: 'ack'|'read'
 */
router.put(`/notifications/`, authenticate,
    handleErrorAsync(async (req, res) => {
        const status = req.body.status;
        const updated = status === 'ack' ? await ackIncomingNotifications(req.userId) : await markAllNotfsAsRead(req.userId)
        res.status(httpCodes.OK).send(updated)
    }))

export { router as notificationsRouter }