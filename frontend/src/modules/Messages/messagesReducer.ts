import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HashTable } from "../../utils/utils";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { authActions } from "../Auth/authReducer";
import { message } from "../../api/schema";

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

export type ConversationObject = {
    conversationId: string;
    interlocutorId: string;
    lastMessageId?: string;
}

export interface MessagesState {
    entities: HashTable<MessageObject>; // messages
    users: HashTable<{
        messagesList: Array<{ messageId: string, createdAt: any }>;
        offset?: string;
        isLoading: boolean;
        allMessagesLoaded: boolean;
    }>;// hashtable with a list of messages ids for each user
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
                state.activeChats = [{ userId: action.payload.userId, isOpen: true }, ...state.activeChats]
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
            const newMsgCreated = {
                messageId: action.payload.message.id,
                createdAt: action.payload.message.createdAt
            };
            state.entities[action.payload.message.id] = action.payload.message
            if (state.users[action.payload.interlocutorId]) {
                state.users[action.payload.interlocutorId].messagesList.push(newMsgCreated)
            } else {
                state.users[action.payload.interlocutorId] = {
                    messagesList: [newMsgCreated],
                    allMessagesLoaded: false,
                    isLoading: false
                }
            }
        },
        fetchConversationsRequest: (state) => {
            state.conversations.isLoading = true
        },
        fetchConversationsSuccess: (state, action: PayloadAction<{ conversations: HashTable<ConversationObject>; messages?: HashTable<MessageObject> }>) => {
            state.conversations.isLoading = false
            state.entities = {
                ...state.entities,
                ...action.payload.messages
            }
            state.conversations.entities = action.payload.conversations
        },
        fetchConversationsError: (state) => {
            state.conversations.isLoading = false
        },
        fetchMessagesRequest: (state, action: PayloadAction<{ otherUserId: string }>) => {
            if (state.users[action.payload.otherUserId]) {
                state.users[action.payload.otherUserId].isLoading = true
            } else {
                state.users[action.payload.otherUserId] = {
                    isLoading: true,
                    allMessagesLoaded: false,
                    messagesList: []
                }
            }
        },
        fetchMessagesSuccess: (state, action: PayloadAction<{ messages?: HashTable<MessageObject>; otherUserId: string }>) => {
            if (!action.payload.messages) {
                state.users[action.payload.otherUserId].allMessagesLoaded = true
                return
            }
            state.entities = {
                ...state.entities,
                ...action.payload.messages
            }
            const listMessages = Object.values(action.payload.messages).map(({ id, createdAt }) => ({
                messageId: id,
                createdAt
            }));
            state.users[action.payload.otherUserId].isLoading = false
            const msgs = [...state.users[action.payload.otherUserId].messagesList]
            listMessages.forEach(({ messageId, createdAt }) => {
                if (!msgs.find((msg) => msg.messageId === messageId)) msgs.push({ messageId, createdAt })
            })
            console.log('listMEssages=', listMessages);
            state.users[action.payload.otherUserId].messagesList = msgs
            state.users[action.payload.otherUserId].offset = msgs[msgs.length - 1].createdAt
        }
    },
    extraReducers: {
        [authActions.logOutSuccess.type]: _ => initialState
    }
})

const persistConfig = {
    key: messagesSlice.name,
    storage,
    whitelist: ['activeChats']
};

export const messagesReducer = persistReducer(persistConfig, messagesSlice.reducer);
export const messagesActions = messagesSlice.actions