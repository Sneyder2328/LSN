import {Router} from "express";
import authenticate from "../../middlewares/authenticate";
import httpCodes from "../../utils/constants/httpResponseCodes";
import {deleteMessageValidationRules, getMessagesValidationRules, validate} from "../../middlewares/validate";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import {deleteMessage, getConversations, getMessages} from "./messagesService";


const router = Router()

/** ?offset='date'&limit='number'
 * Get messages in conversation with other user
 */
router.get('/conversations/:otherUserId/messages', authenticate,
    getMessagesValidationRules, validate, handleErrorAsync(async (req, res) => {
        const messages = await getMessages(req.userId, req.params.otherUserId, req.query.offset, req.query.limit)
        res.status(httpCodes.OK).send(messages)
    }))

/**
 * Get conversations of the current user
 */
router.get('/conversations/', authenticate, handleErrorAsync(async (req, res) => {
    const conversations = await getConversations(req.userId)
    res.status(httpCodes.OK).send(conversations)
}))

/**
 * Delete a message given its id
 * Use soft-delete in case of deleting it for a single user
 * Otherwise, use hard delete
 */
router.delete('/messages/:messageId', authenticate, deleteMessageValidationRules, validate,
    handleErrorAsync(async (req, res) => {
        const deleted = await deleteMessage(req.userId, req.params.messageId, req.query.deleteFor)
        res.status(httpCodes.OK).send(deleted != undefined)
    }))

export {router as messagesRouter}