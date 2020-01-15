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

export async function getPosts() {
    let posts = await Post.findAll({
        include: [
            {model: Profile, as: 'authorProfile'},
            {
                model: Comment,
                as: 'comments',
                limit: LIMIT_COMMENTS_PER_POST,
                order: [['createdAt', 'DESC']],
                include: [Profile]
            }
        ]
    });
    posts = posts.map(post => post.toJSON()).map(post => ({
        ...post, comments: post.comments.map(comment => {
            comment.authorProfile = comment.Profile;
            delete comment.Profile;
            return comment;
        }).sort(compareByDateDesc)
    })).sort(compareByDateAsc);

    if (!posts) return [];
    return posts;
}

export async function likePost(userId, postId) {
    // @ts-ignore
    return PostLike.upsert({userId, postId, isLike: true});
}

export async function removeLikeOrDislikePost(userId, postId) {
    // @ts-ignore
    const postLike = await PostLike.findOne({where: {userId, postId}});
    return await postLike.destroy() != null;
}

export async function dislikePost(userId, postId) {
    // @ts-ignore
    const postLike = await PostLike.upsert({userId, postId, isLike: false});
    return postLike !== null;
}