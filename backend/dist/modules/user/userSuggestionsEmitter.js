"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const relationshipService_1 = require("./relationshipService");
class UserSuggestionsEmitter extends events_1.default {
}
exports.GENERATE_USERS_SUGGESTIONS = 'generateSuggestions';
exports.DELETE_USER_SUGGESTION = 'deleteUserSuggestion';
exports.userSuggestionsEmitter = new UserSuggestionsEmitter();
exports.userSuggestionsEmitter.on(exports.GENERATE_USERS_SUGGESTIONS, (userId) => {
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('generating suggestions for', userId);
        const result = yield relationshipService_1.generateUserSuggestions(userId);
        console.log('result of generated suggestions=', result);
        // result of generated suggestions= [ { affectedRows: 56, insertId: 0, warningStatus: 0 }, undefined ]
    }));
});
exports.userSuggestionsEmitter.on(exports.DELETE_USER_SUGGESTION, (userId, userSuggestedId) => {
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        yield relationshipService_1.removeUserSuggestion(userId, userSuggestedId);
    }));
});
