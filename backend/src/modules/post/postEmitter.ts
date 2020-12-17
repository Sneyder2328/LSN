import EventEmitter from "events";
import {getHashtag, saveHashtag, saveHashtagPost} from "./postService";
import {genUUID} from "../../utils/utils";

class PostEmitter extends EventEmitter {
}

export const POST_CREATED = 'postCreated'

export const postEmitter = new PostEmitter();

postEmitter.on(POST_CREATED, ({postId, text}) => {
    setImmediate(async () => {
        const hashtagsUsed: Array<string> = [...new Set<string>(text.match(/#\w+/g).map((hashtag) => hashtag.slice(1)))]
        console.log('POST_CREATED', postId, text, hashtagsUsed);
        hashtagsUsed.map(async (hashtag) => {
            let hashtagId = await getHashtag(hashtag)
            if (!hashtagId) {
                hashtagId = genUUID()
                await saveHashtag(hashtagId, hashtag)
            }
            await saveHashtagPost(hashtagId, postId)
        })
    });
})