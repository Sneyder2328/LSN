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