import {models, sequelize} from "../../database/database";
import {LIMIT_COMMENTS_PER_POST} from "../../utils/constants";
import {compareByDateAsc, compareByDateDesc, genUUID} from "../../utils/utils";
import {PostNotCreatedError} from "../../utils/errors/PostNotCreatedError";
import {LikesInfo} from "../../utils/types";
import {fetchCommentLikeStatus} from "../comment/commentService";
import {AppError} from "../../utils/errors/AppError";
import responseCodes from "../../utils/constants/httpResponseCodes";
import {ActivityType, generateNotification} from "../notification/notificationService";
import {POST_CREATED, postEmitter} from "./postEmitter";

const {Comment, Post, PostLike, Profile, PostImage} = models;

export async function createPost(postId: string, userId: string, type: string, text: string, images?: Array<string>) {
    const post = await Post.create({id: postId, userId, type, text});
    if (!post) throw new PostNotCreatedError();
    postEmitter.emit(POST_CREATED, {postId, text})
    const response = post.toJSON();
    response.authorProfile = (await Profile.findByPk(userId)).toJSON();
    response.comments = [];
    if (images) {
        response.images = await Promise.all(images.map(url => PostImage.create({id: genUUID(), postId, url})));
    } else {
        response.images = [];
    }
    return response;
}

export const processPosts = async (posts, userId: string) => {
    const postLikeStatusList = (await Promise.all(
            posts.map(post => fetchPostLikeStatus(post.id, userId)))
    ).filter(it => it != null);
    // console.log('postLikeStatusList', postLikeStatusList);

    const commentLikeStatusList = (await Promise.all(
            posts.map(post => post.comments.map(comment => comment.id))
                .filter(it => it.lenght !== 0)
                .flat()
                .map(commentId => fetchCommentLikeStatus(commentId, userId)))
    ).filter(it => it != null);
    // console.log('commentLikeStatusList', commentLikeStatusList);

    posts = posts.map(post => {
        const postLikeStatus: any = postLikeStatusList.find((postLike: any) => postLike.postId === post.id);
        return {
            ...post,
            likeStatus: postLikeStatus != null ? (postLikeStatus.isLike === true ? 'like' : 'dislike') : undefined,
            comments: post.comments.map(comment => {
                const commentLikeStatus: any = commentLikeStatusList.find((commentLike: any) => commentLike.commentId === comment.id);
                comment.likeStatus = commentLikeStatus != null ? (commentLikeStatus.isLike === true ? 'like' : 'dislike') : undefined;
                comment.authorProfile = comment.Profile;
                delete comment.Profile;
                return comment;
            }).sort(compareByDateDesc)
        }
    }).sort(compareByDateAsc);
    return posts;
};

export async function getPostsBySection(userId: string, section: string, offset: string, limit: string) {
    console.log('offset', offset, 'limit', limit);
    
    let posts = await Post.findAll({
        include: [
            {
                model: Profile,
                as: 'authorProfile'
            },
            {
                model: PostImage,
                as: 'images',
                attributes: ['url', 'id']
            },
            {
                model: Comment,
                as: 'comments',
                limit: LIMIT_COMMENTS_PER_POST,
                order: [['createdAt', 'DESC']],
                include: [Profile]
            }
        ],
        order: [['createdAt', 'DESC']],
        // offset,
        limit: [parseInt(offset), parseInt(limit)]
    });
    posts = posts.map(post => post.toJSON());
    posts = await processPosts(posts, userId);

    if (!posts) return [];
    return posts;
}

export async function getPostsByHashtag(userId: string, hashtag: string, offset: string, limit: number) {
    console.log('offset', offset, 'limit', limit);
    
    let posts = await Post.findAll({
        include: [
            {
                model: Profile,
                as: 'authorProfile'
            },
            {
                model: PostImage,
                as: 'images',
                attributes: ['url', 'id']
            },
            {
                model: Comment,
                as: 'comments',
                limit: LIMIT_COMMENTS_PER_POST,
                order: [['createdAt', 'DESC']],
                include: [Profile]
            }
        ],
        order: [['createdAt', 'DESC']],
        // offset,
        limit: [parseInt(offset), limit]
    });
    posts = posts.map(post => post.toJSON());
    posts = await processPosts(posts, userId);

    if (!posts) return [];
    return posts;
}

export async function getPost(userId: string, postId: string) {
    let post = await Post.findByPk(postId, {
        include: [
            {
                model: Profile,
                as: 'authorProfile'
            },
            {
                model: PostImage,
                as: 'images',
                attributes: ['url', 'id']
            },
            {
                model: Comment,
                as: 'comments',
                limit: LIMIT_COMMENTS_PER_POST,
                order: [['createdAt', 'DESC']],
                include: [Profile]
            }
        ]
    });
    if (!post) throw new AppError(responseCodes.NOT_FOUND, 'Not found', 'Post not found')
    post = post.toJSON()
    post = await processPosts([post], userId);

    if (!post[0]) return {};
    return post[0];
}

export async function getPostPreview(postId: string) {
    let post = await Post.findByPk(postId);
    if (!post) throw new AppError(responseCodes.NOT_FOUND, 'Not found', 'Post not found')
    return post;
}

export async function getPostFromPhoto(userId: string, photoId: string) {
    const postImage = await PostImage.findByPk(photoId)
    if (!postImage) throw new AppError(responseCodes.NOT_FOUND, 'Not found', 'photo not found')
    return getPost(userId, postImage.postId)
}

export async function getPostAuthorId(postId: string) {
    const result = await sequelize.query(`SELECT U.userId as userId
FROM Post P
         JOIN Profile U ON P.userId = U.userId
WHERE P.id = '${postId}'`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    // @ts-ignore
    return result[0]?.userId
}

// @ts-ignore
const fetchPostLikeStatus = async (postId, userId) => (await PostLike.findOne({where: {postId, userId}}));

export async function likePost(userId, postId): Promise<LikesInfo | false> {
    return interactWithPost(userId, postId, true);
}

export async function dislikePost(userId, postId): Promise<LikesInfo | false> {
    return interactWithPost(userId, postId, false);
}

async function interactWithPost(userId, postId, isLike: boolean): Promise<LikesInfo | false> {
    const postAuthorId = await getPostAuthorId(postId)
    generateNotification(postId, postAuthorId, userId, ActivityType.POST_LIKED, postId);
    // @ts-ignore
    const currentPostLike = await PostLike.findOne({where: {userId, postId}});
    if (currentPostLike) {
        if (currentPostLike.isLike === !isLike && await currentPostLike.update({isLike}) != null) {
            return findPostLikesInfoByPk(postId);
        }
    }
    // @ts-ignore
    else if (await PostLike.create({userId, postId, isLike}) != null)
        return findPostLikesInfoByPk(postId);
    return false;
}

export async function removeLikeOrDislikeFromPost(userId, postId): Promise<LikesInfo | false> {
    // @ts-ignore
    const postLike = await PostLike.findOne({where: {userId, postId}});
    if (await postLike.destroy() != null)
        return findPostLikesInfoByPk(postId);
    return false;
}


async function findPostLikesInfoByPk(postId: string): Promise<LikesInfo> {
    return await Post.findByPk(postId, {
        attributes: ['id', 'likesCount', 'dislikesCount']
    });
}

export async function getTrendingHashtags() {
    const hashtags: any = await sequelize.query(`
SELECT COUNT(*) as count, name
FROM Hashtag H
         JOIN Hashtag_POST HP ON H.id = HP.hashtagId
         JOIN Post P ON P.id = HP.postId
WHERE P.createdAt >= CURRENT_DATE()
GROUP BY name
ORDER BY COUNT(*) DESC
LIMIT 7;`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    return hashtags
}

export async function getHashtag(hashtag: string) {
    const hashtags: any = await sequelize.query(`
SELECT id as hashtagId FROM Hashtag 
WHERE name = '${hashtag}'  
LIMIT 1
`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    return hashtags?.[0]?.hashtagId
}

export async function saveHashtag(id: string, name: string) {
    const resultInsert = await sequelize.query(`
INSERT INTO Hashtag(id, name) 
VALUES('${id}', '${name}')`)
}

export async function saveHashtagPost(hashtagId: string, postId: string) {
    const resultInsert = await sequelize.query(`
INSERT INTO Hashtag_Post(hashtagId, postId) 
VALUES('${hashtagId}', '${postId}')`)
}