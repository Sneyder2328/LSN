const {Comment, CommentLike, Profile} = require('../database/database');
const CommentNotCreatedError = require('../utils/errors/CommentNotCreatedError');

async function createComment(userId, postId, {id, type, text, img}) {
    const comment = await Comment.create({id, userId, postId, type, text, img});
    if (!comment) throw new CommentNotCreatedError();
    const response = comment.toJSON();
    response.authorProfile = (await Profile.findByPk(userId)).toJSON();
    return response;
}

async function likeComment(userId, commentId) {
    const commentLike = await CommentLike.upsert({userId, commentId, isLike: true});
    return commentLike !== null;
}

async function removeLikeOrDislikeComment(userId, commentId) {
    const commentLike = await CommentLike.findOne({where: {userId, commentId}});
    return await commentLike.destroy() != null;
}

async function dislikeComment(userId, commentId) {
    const commentLike = await CommentLike.upsert({userId, commentId, isLike: false});
    return commentLike !== null;
}

async function getComments(postId) {
    const comments = await Comment.findAll({where: {postId}});
    if (!comments) return [];
    return comments;
}

module.exports = {createComment, likeComment, dislikeComment, removeLikeOrDislikeComment, getComments};