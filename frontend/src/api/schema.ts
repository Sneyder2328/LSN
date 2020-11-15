import {schema} from "normalizr";

export const user = new schema.Entity('users', {}, {
    idAttribute: "userId"
});
export const comment = new schema.Entity('comments', {
    authorProfile: user
});
export const post = new schema.Entity('posts', {
    authorProfile: user,
    comments: [comment]
});
export const profile = new schema.Entity('profile', {
    posts: [post]
},{
    idAttribute: "userId"
})

export const message = new schema.Entity('messages')

export const conversation = new schema.Entity('conversations', {
    authorProfile: user,
    message: message,
}, {
    idAttribute: "conversationId",
    processStrategy: (entity) => {
        return {
            ...entity,
            lastMessageId: entity.message.id
        }
    }
})