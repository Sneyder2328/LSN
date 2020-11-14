import socketIO from "socket.io";
import {isRealString} from "../../utils/utils";
import {models, sequelize} from "../../database/database";
import {getConversationId, sendMessage} from "../message/messagesService";

const {Token} = models

const CREATE_MESSAGE_EVENT = 'createMessage'
const NEW_MESSAGE_EVENT = 'newMessage'

export const handleSocket = (io: socketIO.Server) => {
    io.on('connection', socket => {
        console.log('new user connected');

        socket.on('join', async (params: { refreshToken: string }, callback) => {
            if (!isRealString(params.refreshToken)) return callback("Invalid token");
            const token = await Token.findByPk(params.refreshToken);
            if (!token) return callback("Token passed is not existent");
            socket.join(token.userId);
            callback();
        });

        socket.on(CREATE_MESSAGE_EVENT, async (message: {
            id: string
            senderToken: string
            recipientId: string
            content: string
            typeContent: 'image' | 'text'
        }, callback) => {
            console.log(CREATE_MESSAGE_EVENT, message);
            const token = await Token.findByPk(message.senderToken);
            if (!token) return callback("Token passed is not existent");

            const {conversationId} = await getConversationId(token.userId, message.recipientId)
            await sendMessage(
                {id: message.id, conversationId, userId: token.userId, content: message.content}
            )

            io.to(message.recipientId).to(token.userId).emit(NEW_MESSAGE_EVENT, {
                id: message.id,
                senderId: token.userId,
                recipientId: message.recipientId,
                content: message.content,
                typeContent: message.typeContent,
                status: 'sent',
                createdAt: new Date()
            });
            callback();
        })

        socket.on('disconnect', () => {
            console.log('disconnected from user');
        });
    })
}