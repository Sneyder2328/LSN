const {Comment, CommentLike} = require('../database/database');
const CommentNotCreatedError = require('../utils/errors/CommentNotCreatedError');

async function createComment(userId, {id, postId, type, text, img}) {
    const comment = await Comment.create({id, userId, postId, type, text, img});
    if (!comment) throw new CommentNotCreatedError();
    return comment;
}

async function likeComment(userId, commentId) {
    const commentLike = await CommentLike.create({userId, commentId});
    return commentLike !== null;
}

module.exports = {createComment, likeComment};