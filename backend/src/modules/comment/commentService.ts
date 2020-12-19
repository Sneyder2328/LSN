import { models, sequelize } from "../../database/database";

const { Comment, CommentLike, Profile } = models;
import { CommentNotCreatedError } from "../../utils/errors/CommentNotCreatedError";
import { compareByDateDesc } from "../../utils/utils";
import { LikesInfo } from "../../utils/types";
import { AppError } from "../../utils/errors/AppError";
import responseCodes from "../../utils/constants/httpResponseCodes";
import { ActivityType, generateNotification } from "../notification/notificationService";
import { getPostAuthorId } from "../post/postService";

export async function createComment(userId, postId, { id, type, text, img }) {
    const comment = await Comment.create({ id, userId, postId, type, text, img });
    if (!comment) throw new CommentNotCreatedError();
    const response = comment.toJSON();
    response.authorProfile = (await Profile.findByPk(userId)).toJSON();
    const postAuthorId = await getPostAuthorId(postId)
    generateNotification(id, postAuthorId, userId, ActivityType.POST_COMMENTED, postId);
    return response;
}

export async function likeComment(userId, commentId): Promise<LikesInfo | false> {
    return interactWithComment(userId, commentId, true);
}

export async function dislikeComment(userId, commentId): Promise<LikesInfo | false> {
    return interactWithComment(userId, commentId, false);
}

async function interactWithComment(userId, commentId, isLike: boolean): Promise<LikesInfo | false> {
    // generateNotification(commentId, id of comment author, userId, 'comment_liked'); TODO
    const { postId, postAuthorId } = await getPostAuthorIdFromComment(commentId)
    generateNotification(commentId, postAuthorId, userId, ActivityType.COMMENT_LIKED, postId);
    // @ts-ignore
    const currentCommentLike = await CommentLike.findOne({ where: { userId, commentId } });
    if (currentCommentLike) {
        if (currentCommentLike.isLike === !isLike && await currentCommentLike.update({ isLike }) != null) {
            return findCommentLikesInfoByPk(commentId);
        }
    }
    // @ts-ignore
    else if (await CommentLike.create({ userId, commentId, isLike }) != null)
        return findCommentLikesInfoByPk(commentId);
    return false;
}

export async function getPostAuthorIdFromComment(commentId: string) {
    const result = await sequelize.query(`
SELECT U.userId as userId, P.id as postId
FROM Comment C
         JOIN Post P ON C.postId = P.id
         JOIN Profile U ON U.userId = P.userId
WHERE C.id = '${commentId}'
`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    // @ts-ignore
    return { postAuthorId: result[0]?.userId, postId: result[0]?.postId }
}

export async function removeLikeOrDislikeComment(userId, commentId): Promise<LikesInfo | false> {
    // @ts-ignore
    const commentLike = await CommentLike.findOne({ where: { userId, commentId } });
    if (await commentLike.destroy() != null)
        return findCommentLikesInfoByPk(commentId);
    return false;
}

async function findCommentLikesInfoByPk(commentId): Promise<LikesInfo> {
    return (await Comment.findByPk(commentId, {
        attributes: ['id', 'likesCount', 'dislikesCount']
    })).dataValues;
}


export async function getComments(userId, postId, offset, limit) {
    let comments = await Comment.findAll({
        where: { postId },
        order: [['createdAt', 'DESC']],
        offset: parseInt(offset),
        limit: parseInt(limit),
        include: [{ model: Profile }]
    });
    if (!comments) return [];

    const commentLikeStatusList = (await Promise.all(
        comments.map(comment => fetchCommentLikeStatus(comment.id, userId)))
    ).filter(it => it != null);
    console.log('commentLikeStatusList', commentLikeStatusList);

    comments = comments.map(it => it.toJSON()).map(comment => {
        const commentLikeStatus: any = commentLikeStatusList.find((commentLike: any) => commentLike.commentId === comment.id);
        comment.likeStatus = commentLikeStatus != null ? (commentLikeStatus.isLike === true ? 'like' : 'dislike') : undefined;
        comment.authorProfile = comment.Profile;
        delete comment.Profile;
        return comment;
    }).sort(compareByDateDesc);
    return comments;
}

export async function getComments2(currentUserId: string, postId: string, limit: number, offset?: string) {
    let comments = await sequelize.query(`
    SELECT C.id,
    C.userId,
    C.postId,
    C.type,
    C.text,
    C.img,
    C.createdAt,
    C.likesCount,
    C.dislikesCount,
    Pr.userId          as 'author.userId',
    Pr.username        as 'author.username',
    Pr.fullname        as 'author.fullname',
    Pr.coverPhotoUrl   as 'author.coverPhotoUrl',
    Pr.profilePhotoUrl as 'author.profilePhotoUrl',
    Pr.description     as 'author.description'
FROM Comment C
      JOIN Post P ON P.id = C.postId
      JOIN Profile Pr ON Pr.userId = C.userId
WHERE P.id = '${postId}'` + (offset ? ` AND C.createdAt <= '${offset}'` : ``)
        + `ORDER BY C.createdAt DESC LIMIT ${limit};
    `, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })

    // @ts-ignore
    comments = await Promise.all(comments.map(
        // @ts-ignore
        async ({ id, userId, postId, likesCount, commentsCount, createdAt, type, text, dislikesCount, ...author }) => {
            return {
                id, userId, likesCount, commentsCount, createdAt, text, dislikesCount,
                authorProfile: {
                    userId: author['author.userId'],
                    username: author['author.username'],
                    fullname: author['author.fullname'],
                    coverPhotoUrl: author['author.coverPhotoUrl'],
                    profilePhotoUrl: author['author.profilePhotoUrl'],
                    description: author['author.description'],
                },
                likeStatus: await getLikeStatusForComment(id, currentUserId)
            }
        }))
    // @ts-ignore
    return comments.sort(compareByDateDesc);
}

async function getLikeStatusForComment(commentId: string, userId: string) {
    const commentLikeStatus: any = await fetchCommentLikeStatus(commentId, userId)
    return commentLikeStatus != null ? (commentLikeStatus.isLike === true ? 'like' : 'dislike') : undefined;
}

export async function getCommentPreview(commentId: string) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new AppError(responseCodes.NOT_FOUND, 'Not found', 'Comment not found')
    return comment;
}

// @ts-ignore
export const fetchCommentLikeStatus = async (commentId, userId) => (await CommentLike.findOne({
    where: {
        commentId,
        userId
    }
}));