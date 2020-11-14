import {AppThunk} from "../../store";
import {MessagesApi} from "./messagesApi";
import {ConversationObject, messagesActions} from "./messagesReducer";
import {normalize} from "normalizr";
import {conversation} from "../../api/schema";
import {HashTable} from "../../utils/utils";
import {UserObject, usersActions} from "../User/userReducer";

export const fetchMessages = (otherUserId: string): AppThunk => async (dispatch) => {
    try {
        const response = await MessagesApi.getMessages(otherUserId)
        console.log('fetchMessages response=', response.data);
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
        const conversations = normalizedData.entities.conversations as HashTable<ConversationObject>
        const users = normalizedData.entities.users as HashTable<UserObject>
        dispatch(usersActions.setUsers(users))
        dispatch(messagesActions.fetchConversationsSuccess(conversations))
    } catch (err) {
        console.log('fetchConversations err', err)
        dispatch(messagesActions.fetchConversationsError())
    }
}