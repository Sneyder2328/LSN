import {sequelize} from "../../database/database";
import {genUUID} from "../../utils/utils";


export const getMessages = async (userId: string, otherUserId: string) => {
    let conversationId: any = await sequelize.query(`SELECT id FROM Conversation 
WHERE (userOneId='${userId}' AND userTwoId='${otherUserId}') 
OR (userOneId='${otherUserId}' AND userTwoId='${userId}') 
LIMIT 1`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    console.log('conversationId=', conversationId);
    conversationId = conversationId[0]?.id
    if (!conversationId) {
        conversationId = genUUID()
        const resultInsert = await sequelize.query(`INSERT INTO Conversation(id, userOneId, userTwoId) VALUES('${conversationId}', '${userId}', '${otherUserId}')`)
        console.log('resultInsert=', resultInsert);
        return []
    }
    return sequelize.query(`SELECT userId, replyTo, content, typeContent, status, createdAt FROM Message WHERE conversationId = '${conversationId}'`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
}

export const getConversations = async (userId: string) => {
    const conversations: any = await sequelize.query(`SELECT C.userTwoId as interlocutorId, C.id as conversationId, 
P.username as username, P.fullname as fullname, P.description as description,
P.coverPhotoUrl as coverPhotoUrl, P.profilePhotoUrl as profilePhotoUrl, P.userId as userId
FROM Conversation C JOIN Profile P ON P.userId=C.userTwoId
WHERE userOneId='${userId}'`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    return conversations.map(({interlocutorId, conversationId, username, fullname, description, coverPhotoUrl, profilePhotoUrl, userId}) => {
        return {
            conversationId,
            interlocutorId,
            authorProfile: {
                userId, username, fullname, description, coverPhotoUrl, profilePhotoUrl
            }
        }
    })
}