import {models} from "../../database/database";
import {UserNotFoundError} from "../../utils/errors/UserNotFoundError";
import {Op} from "sequelize";
import {LIMIT_COMMENTS_PER_POST} from "../../utils/constants";
import {processPosts} from "../post/postService";
import {getRelationshipType} from "./relationshipService";

const {Post, Profile, PostImage, Comment} = models;

const includePostsSorted = [
    {
        model: Post,
        as: 'posts',
        include: [
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
    }
];


export async function getProfileByUsername(username: string, includePosts: boolean, currentUserId: string) {
    let user;
    if (includePosts) {
        user = await Profile.findOne({where: {username}, include: includePostsSorted});
        // console.log('getProfileByUsername posts are', user.posts, user.posts.length);
        if (user.posts && user.posts.length !== 0) {
            user = user.toJSON();
            user.posts = await processPosts(user.posts, currentUserId)
        }
    } else {
        user = await Profile.findOne({where: {username}});
    }
    user.relationship = await getRelationshipType(currentUserId, user.userId)
    if (!user) throw new UserNotFoundError();
    return user;
}

export async function getProfileByUserId(userId, includePosts: boolean, currentUserId: string) {
    let user;
    if (includePosts) {
        user = await Profile.findByPk(userId, {include: includePostsSorted});
        // console.log('getProfileByUserId posts are', user.posts);
        if (user.posts && user.posts.length !== 0) {
            user = user.toJSON();
            user.posts = await processPosts(user.posts, currentUserId)
        }
    } else {
        user = await Profile.findByPk(userId);
    }
    user.relationship = await getRelationshipType(currentUserId, userId)
    if (!user) throw new UserNotFoundError();
    return user;
}

export async function updateProfile(userId: string,
                                    {
                                        username, fullname, description
                                    },
                                    imageFiles?: { imageProfile?: Array<any>; imageCover?: Array<any> }) {
    const profilePhotoUrl = imageFiles?.imageProfile?.[0]?.url
    const coverPhotoUrl = imageFiles?.imageCover?.[0]?.url
    if (profilePhotoUrl && coverPhotoUrl) {
        await Profile.update({username, fullname, description, profilePhotoUrl, coverPhotoUrl}, {where: {userId}});
    } else if (profilePhotoUrl) {
        await Profile.update({username, fullname, description, profilePhotoUrl}, {where: {userId}});
    } else if (coverPhotoUrl) {
        await Profile.update({username, fullname, description, coverPhotoUrl}, {where: {userId}});
    } else {
        // console.log('updating only', username, fullname, description);
        await Profile.update({username, fullname, description}, {where: {userId}});
    }
    return await Profile.findByPk(userId)
}

/**
 * Search users given the query matches the beginning of the full name
 * @param query (aka full name of the user looked for)
 */
export async function searchUser(query: string) {
    return Profile.findAll({
        attributes: ['userId', 'username', 'fullname', 'profilePhotoUrl'],
        where: {
            fullname: {
                [Op.like]: `${query}%`
            }
        }
    });
}