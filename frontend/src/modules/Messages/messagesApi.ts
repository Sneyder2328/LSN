import {transport} from "../../api";
import {AxiosResponse} from "axios";
import {ConversationObject, MessageObject} from "./messagesReducer";

export const MessagesApi = {
    async getMessages(otherUserId: string): Promise<AxiosResponse<Array<MessageObject>>> {
        return await transport.get(`/messages/${otherUserId}`);
    },
    async getConversations(): Promise<AxiosResponse<Array<ConversationObject>>> {
        return await transport.get(`/conversations/`);
    }
}