import {transport} from "../../api";
import {AxiosResponse} from "axios";
import {ConversationObject, MessageObject} from "./messagesReducer";

export const MessagesApi = {
    async getMessages(otherUserId: string): Promise<AxiosResponse<Array<MessageObject>>> {
        return await transport.get(`/conversations/${otherUserId}/messages`);
    },
    async deleteMessage(messageId: string, deleteFor: string): Promise<AxiosResponse<Boolean>> {
        return await transport.delete(`/messages/${messageId}`, {
            params: {deleteFor}
        });
    },
    async getConversations(): Promise<AxiosResponse<Array<ConversationObject>>> {
        return await transport.get(`/conversations/`);
    }
}