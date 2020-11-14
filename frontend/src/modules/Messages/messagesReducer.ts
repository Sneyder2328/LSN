import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HashTable} from "../../utils/utils";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";

export interface MessageObject {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    typeContent: 'image' | 'text';
    status: 'sent' | 'delivered' | 'read';
    createdAt?: any;
    replyTo?: string;
}

export type ActiveChat = { isOpen: boolean; userId: string };

export type ConversationObject = { conversationId: string; interlocutorId: string; }

export interface MessagesState {
    entities: HashTable<MessageObject>; // messages
    users: HashTable<Array<string>>; // hashtable with a list of messages ids for each user
    conversations: {
        isLoading: boolean;
        entities: HashTable<ConversationObject>;
    }; // list of conversations of the current user
    activeChats: Array<ActiveChat>; // list of ids of users whose there is an ongoing chat open
}

const initialState = {
    activeChats: [],
    conversations: {
        entities: {},
        isLoading: false
    },
    entities: {},
    users: {}
} as MessagesState

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        openBubbleChat: (state, action: PayloadAction<{ userId: string }>) => {
            console.log('openBubbleChat');
            if (state.activeChats.some((it) => it.userId === action.payload.userId)) {
                state.activeChats = state.activeChats.map((it) => it.userId === action.payload.userId ? {
                    userId: it.userId,
                    isOpen: true
                } : it)
                console.log('openBubbleChat updates=', state.activeChats);
            } else {
                state.activeChats = [{userId: action.payload.userId, isOpen: true}, ...state.activeChats]
            }
        },
        hideBubbleChat: (state, action: PayloadAction<{ userId: string }>) => {
            state.activeChats = state.activeChats.map((it) => it.userId === action.payload.userId ? {
                userId: it.userId,
                isOpen: false
            } : it)
        },
        closeBubbleChat: (state, action: PayloadAction<{ userId: string }>) => {
            state.activeChats = state.activeChats.filter((it) => it.userId !== action.payload.userId)
        },
        sendMessage: (state, action: PayloadAction<{ event: string; data: any; result?: any; error?: any }>) => {
            console.log('sendMessage action=', action);
        },
        newMessageSuccess: (state, action: PayloadAction<{ message: MessageObject; interlocutorId: string }>) => {
            state.entities[action.payload.message.id] = action.payload.message
            if (state.users[action.payload.interlocutorId]) {
                state.users[action.payload.interlocutorId] = [...state.users[action.payload.interlocutorId], action.payload.message.id]
            } else {
                state.users[action.payload.interlocutorId] = [action.payload.message.id]
            }
        },
        fetchConversationsRequest: (state) => {
            state.conversations.isLoading = true
        },
        fetchConversationsSuccess: (state, action: PayloadAction<HashTable<ConversationObject>>) => {
            state.conversations.isLoading = false
            state.conversations.entities = action.payload
        },
        fetchConversationsError: (state) => {
            state.conversations.isLoading = false
        }
    }
})

const persistConfig = {
    key: messagesSlice.name,
    storage,
    whitelist: ['activeChats']
};

export const messagesReducer = persistReducer(persistConfig, messagesSlice.reducer);
export const messagesActions = messagesSlice.actions