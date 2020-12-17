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
const postService_1 = require("./postService");
const utils_1 = require("../../utils/utils");
class PostEmitter extends events_1.default {
}
exports.POST_CREATED = 'postCreated';
exports.postEmitter = new PostEmitter();
exports.postEmitter.on(exports.POST_CREATED, ({ postId, text }) => {
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        const hashtagsUsed = [...new Set(text.match(/#\w+/g).map((hashtag) => hashtag.slice(1)))];
        console.log('POST_CREATED', postId, text, hashtagsUsed);
        hashtagsUsed.map((hashtag) => __awaiter(void 0, void 0, void 0, function* () {
            let hashtagId = yield postService_1.getHashtag(hashtag);
            if (!hashtagId) {
                hashtagId = utils_1.genUUID();
                yield postService_1.saveHashtag(hashtagId, hashtag);
            }
            yield postService_1.saveHashtagPost(hashtagId, postId);
        }));
    }));
});
