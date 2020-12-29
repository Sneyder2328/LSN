import { transport } from "../../api";
import { AxiosResponse } from "axios";
import { MessageObject } from "./messagesReducer";

export const MessagesApi = {
    async getMessages(otherUserId: string, offset: any, limit: number): Promise<AxiosResponse<Array<MessageObject>>> {
        return await transport.get(`/conversations/${otherUserId}/messages`, { params: { offset, limit } });
    },
    async deleteMessage(messageId: string, deleteFor: string): Promise<AxiosResponse<Boolean>> {
        return await transport.delete(`/messages/${messageId}`, {
            params: { deleteFor }
        });
    },
    async getConversations(): Promise<AxiosResponse<Array<any>>> {
        return await transport.get(`/conversations/`);
    }
}