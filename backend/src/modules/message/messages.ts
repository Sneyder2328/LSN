import {Router} from "express";
import authenticate from "../../middlewares/authenticate";
import httpCodes from "../../utils/constants/httpResponseCodes";
import {getMessagesValidationRules, validate} from "../../middlewares/validate";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import {getConversations, getMessages} from "./messagesService";


const router = Router()

router.get('/messages/:otherUserId', authenticate,
    getMessagesValidationRules, validate, handleErrorAsync(async (req, res) => {
        const messages = await getMessages(req.userId, req.params.otherUserId)
        res.status(httpCodes.OK).send(messages)
    }))

/**
 * Get conversations of the current user
 */
router.get('/conversations/', authenticate, handleErrorAsync(async (req, res) => {
    const conversations = await getConversations(req.userId)
    res.status(httpCodes.OK).send(conversations)
}))

export {router as messagesRouter}