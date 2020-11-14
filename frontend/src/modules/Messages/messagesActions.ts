import {AppThunk} from "../../store";
import {MessagesApi} from "./messagesApi";
import {ConversationObject, MessageObject, messagesActions} from "./messagesReducer";
import {normalize} from "normalizr";
import {conversation, message} from "../../api/schema";
import {HashTable} from "../../utils/utils";
import {UserObject, usersActions} from "../User/userReducer";

export const fetchMessages = (otherUserId: string): AppThunk => async (dispatch) => {
    try {
        const response = await MessagesApi.getMessages(otherUserId)
        console.log('fetchMessages response=', response.data);
        const messages = normalize(response.data, [message])?.entities?.messages as HashTable<MessageObject> | null
        if (messages) dispatch(messagesActions.fetchMessagesSuccess({messages, otherUserId}))
    } catch (err) {
        console.log('fetchMessages err', err);
    }
}

export const fetchConversations = (): AppThunk => async (dispatch) => {
    dispatch(messagesActions.fetchConversationsRequest())
    try {
        const response = await MessagesApi.getConversations()
        const normalizedData = normalize(response.data, [conversation]);
        console.log(normalizedData)
        const conversations = normalizedData.entities.conversations as HashTable<ConversationObject> | null
        const users = normalizedData.entities.users as HashTable<UserObject> | null
        users && dispatch(usersActions.setUsers(users))
        conversations && dispatch(messagesActions.fetchConversationsSuccess(conversations))
    } catch (err) {
        console.log('fetchConversations err', err)
        dispatch(messagesActions.fetchConversationsError())
    }
}