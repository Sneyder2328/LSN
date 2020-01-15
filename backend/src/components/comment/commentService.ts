import {models} from "../../database/database";
const {Comment, CommentLike, Profile} = models;
import {CommentNotCreatedError} from "../../utils/errors/CommentNotCreatedError";
import {compareByDateDesc} from "../../utils/utils";

export async function createComment(userId, postId, {id, type, text, img}) {
    const comment = await Comment.create({id, userId, postId, type, text, img});
    if (!comment) throw new CommentNotCreatedError();
    const response = comment.toJSON();
    response.authorProfile = (await Profile.findByPk(userId)).toJSON();
    return response;
}

export async function likeComment(userId, commentId) {
    const commentLike = await CommentLike.upsert({userId, commentId, isLike: true});
    return commentLike !== null;
}

export async function removeLikeOrDislikeComment(userId, commentId) {
    const commentLike = await CommentLike.findOne({where: {userId, commentId}});
    return await commentLike.destroy() != null;
}

export async function dislikeComment(userId, commentId) {
    const commentLike = await CommentLike.upsert({userId, commentId, isLike: false});
    return commentLike !== null;
}

export async function getComments(postId, offset, limit) {
    let comments = await Comment.findAll({
        where: {postId},
        order: [['createdAt', 'DESC']],
        offset: parseInt(offset),
        limit: parseInt(limit),
        include: [{model: Profile}]
    });
    if (!comments) return [];
    comments = comments.map(it => it.toJSON()).map(comment => {
        comment.authorProfile = comment.Profile;
        delete comment.Profile;
        return comment;
    }).sort(compareByDateDesc);
    return comments;
}