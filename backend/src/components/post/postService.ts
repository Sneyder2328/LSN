import {models} from "../../database/database";

const {Comment, Post, PostLike, Profile, CommentLike} = models;
import {LIMIT_COMMENTS_PER_POST} from "../../utils/constants";
import {compareByDateAsc, compareByDateDesc, genUUID} from "../../utils/utils";
import {PostNotCreatedError} from "../../utils/errors/PostNotCreatedError";
import {LikesInfo} from "../../utils/types";

export async function createPost(userId, type, text, img) {
    const post = await Post.create({id: genUUID(), userId, type, text, img});
    if (!post) throw new PostNotCreatedError();
    const response = post.toJSON();
    response.authorProfile = (await Profile.findByPk(userId)).toJSON();
    response.comments = [];
    return response;
}

export async function getPosts(userId: string) {
    let posts = await Post.findAll({
        include: [
            {
                model: Profile,
                as: 'authorProfile'
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
    // @ts-ignore
    const fetchPostLikeStatus = async (postId, userId) => (await PostLike.findOne({where: {postId, userId}}));
    // @ts-ignore
    const fetchCommentLikeStatus = async (commentId, userId) => (await CommentLike.findOne({
        where: {
            commentId,
            userId
        }
    }));

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

    posts = posts.map(post => post.toJSON()).map(post => {
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

    if (!posts) return [];
    return posts;
}

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