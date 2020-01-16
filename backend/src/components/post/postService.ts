import {models} from "../../database/database";

const {Comment, Post, PostLike, Profile} = models;
import {LIMIT_COMMENTS_PER_POST} from "../../utils/constants";
import {compareByDateAsc, compareByDateDesc, genUUID} from "../../utils/utils";
import {PostNotCreatedError} from "../../utils/errors/PostNotCreatedError";

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
    const fetchLikeStatus = async (postId, userId) => (await PostLike.findOne({where: {postId, userId}}));
    console.log('new version 1.2');
    const likeStatusList = await Promise.all(posts.map(post => fetchLikeStatus(post.id, userId)));
    console.log('likeStatusList', likeStatusList);

    posts = posts.map(post => post.toJSON()).map(post => {
        const likeStatus: any = likeStatusList.filter(it => it != null).find((postLike: any) => postLike.postId === post.id);
        return {
            ...post,
            likeStatus: likeStatus != null ? (likeStatus.isLike === true ? 'like' : 'dislike') : undefined,
            comments: post.comments.map(comment => {
                comment.authorProfile = comment.Profile;
                delete comment.Profile;
                return comment;
            }).sort(compareByDateDesc)
        }
    }).sort(compareByDateAsc);

    if (!posts) return [];
    return posts;
}

export async function likePost(userId, postId) {
    // @ts-ignore
    const currentLikePost = await PostLike.findOne({where: {userId, postId}});
    if (currentLikePost) {
        if (currentLikePost.isLike === false && await currentLikePost.update({isLike: true}) != null)
            return getFindByPk(postId);
        return false;
    }
    // @ts-ignore
    if (await PostLike.create({userId, postId, isLike: true}) != null)
        return getFindByPk(postId);
}

export async function removeLikeOrDislikePost(userId, postId) {
    // @ts-ignore
    const postLike = await PostLike.findOne({where: {userId, postId}});
    if (await postLike.destroy() != null)
        return getFindByPk(postId);
    return false;
}

async function getFindByPk(postId) {
    return Post.findByPk(postId, {
        attributes: ['id', 'likesCount', 'dislikesCount']
    });
}

export async function dislikePost(userId, postId) {
    // @ts-ignore
    const currentLikePost = await PostLike.findOne({where: {userId, postId}});
    if (currentLikePost) {
        if (currentLikePost.isLike === true && await currentLikePost.update({isLike: false}) != null)
            return getFindByPk(postId);
        return false;
    }
    // @ts-ignore
    if (await PostLike.create({userId, postId, isLike: false}) != null)
        return getFindByPk(postId);
}