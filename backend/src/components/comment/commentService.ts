import {models} from "../../database/database";

const {Comment, CommentLike, Profile} = models;
import {CommentNotCreatedError} from "../../utils/errors/CommentNotCreatedError";
import {compareByDateDesc} from "../../utils/utils";
import {LikesInfo} from "../../utils/types";

export async function createComment(userId, postId, {id, type, text, img}) {
    const comment = await Comment.create({id, userId, postId, type, text, img});
    if (!comment) throw new CommentNotCreatedError();
    const response = comment.toJSON();
    response.authorProfile = (await Profile.findByPk(userId)).toJSON();
    return response;
}

export async function likeComment(userId, commentId): Promise<LikesInfo | false> {
    return interactWithComment(userId, commentId, true);
}

export async function dislikeComment(userId, commentId): Promise<LikesInfo | false> {
    return interactWithComment(userId, commentId, false);
}

async function interactWithComment(userId, commentId, isLike: boolean): Promise<LikesInfo | false> {
    // @ts-ignore
    const currentCommentLike = await CommentLike.findOne({where: {userId, commentId}});
    if (currentCommentLike) {
        if (currentCommentLike.isLike === !isLike && await currentCommentLike.update({isLike}) != null) {
            return findCommentLikesInfoByPk(commentId);
        }
    }
    // @ts-ignore
    else if (await CommentLike.create({userId, commentId, isLike}) != null)
        return findCommentLikesInfoByPk(commentId);
    return false;
}

export async function removeLikeOrDislikeComment(userId, commentId): Promise<LikesInfo | false> {
    // @ts-ignore
    const commentLike = await CommentLike.findOne({where: {userId, commentId}});
    if (await commentLike.destroy() != null)
        return findCommentLikesInfoByPk(commentId);
    return false;
}

async function findCommentLikesInfoByPk(commentId): Promise<LikesInfo> {
    return (await Comment.findByPk(commentId, {
        attributes: ['id', 'likesCount', 'dislikesCount']
    })).dataValues;
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