import EventEmitter from "events";
import {generateUserSuggestions, removeUserSuggestion} from "./relationshipService";

class UserSuggestionsEmitter extends EventEmitter {
}

export const GENERATE_USERS_SUGGESTIONS = 'generateSuggestions'
export const DELETE_USER_SUGGESTION = 'deleteUserSuggestion'

export const userSuggestionsEmitter = new UserSuggestionsEmitter();


userSuggestionsEmitter.on(GENERATE_USERS_SUGGESTIONS, (userId: string) => {
    setImmediate(async () => {
        console.log('generating suggestions for', userId);
        const result = await generateUserSuggestions(userId)
        console.log('result of generated suggestions=', result)
        // result of generated suggestions= [ { affectedRows: 56, insertId: 0, warningStatus: 0 }, undefined ]
    });
});

userSuggestionsEmitter.on(DELETE_USER_SUGGESTION, (userId: string, userSuggestedId: string) => {
    setImmediate(async () => {
        await removeUserSuggestion(userId, userSuggestedId)
    })
})