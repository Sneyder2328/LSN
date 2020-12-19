import { sequelize } from "../../database/database";
import { genUUID } from "../../utils/utils";


export const getConversationId = async (userId: string, otherUserId: string) => {
    let conversationId: any = await sequelize.query(`SELECT id FROM Conversation 
WHERE (userOneId='${userId}' AND userTwoId='${otherUserId}') 
OR (userOneId='${otherUserId}' AND userTwoId='${userId}') 
LIMIT 1`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    conversationId = conversationId[0]?.id
    if (!conversationId) {
        conversationId = genUUID()
        const resultInsert = await sequelize.query(`INSERT INTO Conversation(id, userOneId, userTwoId) VALUES('${conversationId}', '${userId}', '${otherUserId}')`)
        console.log('resultInsert=', resultInsert);
        return { conversationId, created: true }
    }
    return { conversationId, created: false }
}

export const getMessagesPaged = async (userId: string, otherUserId: string, offsetCreatedAt: any, limit: number) => {
    const { conversationId, created } = await getConversationId(userId, otherUserId)
    console.log('getConversationId', conversationId, created)
    if (created) return []
    const sql = offsetCreatedAt ? `SELECT id, userId as senderId, replyTo, content, typeContent, status, createdAt FROM Message 
WHERE createdAt < ${offsetCreatedAt} AND conversationId = '${conversationId}' ORDER BY createdAt DESC LIMIT ${limit}`
        : `SELECT id, userId as senderId, replyTo, content, typeContent, status, createdAt FROM Message 
WHERE conversationId = '${conversationId}' ORDER BY createdAt DESC LIMIT ${limit}`
    const messages: any = await sequelize.query(sql, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    return messages.map(({ id, senderId, replyTo, content, typeContent, status, createdAt }) => {
        return {
            id, senderId, replyTo, content, typeContent, status, createdAt,
            recipientId: senderId === userId ? otherUserId : userId
        }
    })
}

//AND deletedFor != '${userId}'
async function getMessagesByConversation(conversationId, userId: string, otherUserId: string, offset: any, limit: number) {
    const messages: any = await sequelize.query(`
    SELECT id, userId as senderId, replyTo, content, typeContent, status, createdAt FROM Message 
    WHERE conversationId = '${conversationId}'` + (offset ? ` AND createdAt < '${offset}'` : ``) + `
    ORDER BY createdAt DESC 
    LIMIT ${limit}
    `, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    return messages.map(({ id, senderId, replyTo, content, typeContent, status, createdAt }) => {
        return {
            id, senderId, replyTo, content, typeContent, status, createdAt,
            recipientId: senderId === userId ? otherUserId : userId
        }
    })
}

// TODO (find a way to check for deletedFor attr, actually like it is above it is not working as it's returning empty([]))
export const getMessages = async (userId: string, otherUserId: string, offset: any, limit: number) => {
    const { conversationId, created } = await getConversationId(userId, otherUserId)
    console.log('getConversationId', conversationId, created)
    if (created) return []
    return await getMessagesByConversation(conversationId, userId, otherUserId, offset, limit);
}

export const sendMessage = async ({ id, conversationId, userId, content }) => {
    const resultInsert = await sequelize.query(`INSERT INTO Message(id, conversationId, userId, content) 
VALUES('${id}', '${conversationId}', '${userId}', '${content}')`)
    console.log('resultInsert message=', resultInsert);
}

export const deleteMessage = async (userId: string, messageId: string, deleteFor: string) => {
    if (deleteFor === 'both') {
        // TODO verify msg was sent by me, if not throw error
        return sequelize.query(`DELETE FROM Message WHERE id='${messageId}'`)
    }
    if (deleteFor !== userId) {
        throw new Error('You cannot delete a message from someone else\'s record')
    }

    return sequelize.query(`
UPDATE Message SET deletedFor='${userId}}' 
WHERE id='${messageId}'`)
}

/**
 * Get conversations by a given user
 * @param userId
 */
export const getConversations = async (userId: string) => {
    const outgoingConversations: any = await sequelize.query(`
SELECT C.userTwoId as interlocutorId, 
C.id as conversationId, 
P.username as username, 
P.fullname as fullname, 
P.description as description,
P.coverPhotoUrl as coverPhotoUrl, 
P.profilePhotoUrl as profilePhotoUrl, 
P.userId as userId
FROM Conversation C 
JOIN Profile P ON P.userId=C.userTwoId 
WHERE userOneId='${userId}'
`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })

    const incomingConversations: any = await sequelize.query(`
SELECT C.userOneId as interlocutorId, 
C.id as conversationId, 
P.username as username, 
P.fullname as fullname, 
P.description as description,
P.coverPhotoUrl as coverPhotoUrl, 
P.profilePhotoUrl as profilePhotoUrl, 
P.userId as userId
FROM Conversation C 
JOIN Profile P ON P.userId=C.userOneId 
WHERE userTwoId='${userId}'
`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    return (await Promise.all([...outgoingConversations, ...incomingConversations].map(async (
        {
            interlocutorId, conversationId,
            username, fullname, description, coverPhotoUrl, profilePhotoUrl, userId,
        }) => {
        const messages = await getMessagesByConversation(conversationId, userId, interlocutorId, undefined, 1)

        return {
            conversationId,
            interlocutorId,
            authorProfile: {
                userId, username, fullname, description, coverPhotoUrl, profilePhotoUrl
            },
            message: messages?.[0]
        }
    }))).filter(({ message }) => message).sort((conv1, conv2) => conv2.message.createdAt - conv1.message.createdAt) || []
}