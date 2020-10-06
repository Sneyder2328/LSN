import {models} from "../../database/database";
import {LIMIT_COMMENTS_PER_POST} from "../../utils/constants";
import {compareByDateAsc, compareByDateDesc, genUUID} from "../../utils/utils";
import {PostNotCreatedError} from "../../utils/errors/PostNotCreatedError";
import {LikesInfo} from "../../utils/types";
import {fetchCommentLikeStatus} from "../comment/commentService";

const {Comment, Post, PostLike, Profile, PostImage} = models;

export async function createPost(postId: string, userId: string, type: string, text: string, images?: Array<string>) {
    const post = await Post.create({id: postId, userId, type, text});
    if (!post) throw new PostNotCreatedError();
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
    console.log('processPosts', posts, userId);
    const postLikeStatusList = (await Promise.all(
            posts.map(post => fetchPostLikeStatus(post.id, userId)))
    ).filter(it => it != null);
    console.log('postLikeStatusList', postLikeStatusList);

    const commentLikeStatusList = (await Promise.all(
            posts.map(post => post.comments.map(comment => comment.id))
                .filter(it => it.lenght !== 0)
                .flat()
                .map(commentId => fetchCommentLikeStatus(commentId, userId)))
    ).filter(it => it != null);
    console.log('commentLikeStatusList', commentLikeStatusList);

    // posts = posts.map(post => post.toJSON()).map(post => {
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

                console.log('new comment after edit', comment);
                return comment;
            }).sort(compareByDateDesc)
        }
    }).sort(compareByDateAsc);
    console.log('now posts returning ', posts[0].comments);
    return posts;
};

export async function getPosts(userId: string) {
    let posts = await Post.findAll({
        include: [
            {
                model: Profile,
                as: 'authorProfile'
            },
            {
                model: PostImage,
                as: 'images',
                attributes: ['url']
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
    posts = posts.map(post => post.toJSON())
    posts = await processPosts(posts, userId);

    if (!posts) return [];
    return posts;
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

async function findPostLikesInfoByPk(postId): Promise<LikesInfo> {
    return (await Post.findByPk(postId, {
        attributes: ['id', 'likesCount', 'dislikesCount']
    })).dataValues;
}