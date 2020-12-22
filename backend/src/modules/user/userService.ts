import { models, sequelize } from "../../database/database";
import { UserNotFoundError } from "../../utils/errors/UserNotFoundError";
import { Op } from "sequelize";
import { getRelationshipType } from "./relationshipService";

const { User, Profile } = models;

export async function getProfileByUsername(username: string, currentUserId: string) {
    const user = await Profile.findOne({ where: { username } });
    user.setDataValue('relationship', await getRelationshipType(currentUserId, user.userId))
    if (!user)
        throw new UserNotFoundError();
    return user;
}

export async function getProfileByUserId(userId, currentUserId: string, includeRelationship = true) {
    const user = await Profile.findByPk(userId);
    if (includeRelationship)
        user.setDataValue('relationship', await getRelationshipType(currentUserId, userId))
    if (!user)
        throw new UserNotFoundError();
    return user;
}

export async function getUserIdFromUsername(username: string){
    const user = await Profile.findOne({ where: { username } });
    if (!user)
        throw new UserNotFoundError();
    return user.userId
}

export async function updateProfile(userId: string,
    {
        username, fullname, description
    },
    imageFiles?: { imageProfile?: Array<any>; imageCover?: Array<any> }) {
    const profilePhotoUrl = imageFiles?.imageProfile?.[0]?.url
    const coverPhotoUrl = imageFiles?.imageCover?.[0]?.url
    if (profilePhotoUrl && coverPhotoUrl) {
        await Profile.update({ username, fullname, description, profilePhotoUrl, coverPhotoUrl }, { where: { userId } });
    } else if (profilePhotoUrl) {
        await Profile.update({ username, fullname, description, profilePhotoUrl }, { where: { userId } });
    } else if (coverPhotoUrl) {
        await Profile.update({ username, fullname, description, coverPhotoUrl }, { where: { userId } });
    } else {
        // console.log('updating only', username, fullname, description);
        await Profile.update({ username, fullname, description }, { where: { userId } });
    }
    // @ts-ignore
    await User.update({ username }, { where: { id: userId } })
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

/**
 * Get photos by a userId given its posts images
 * @param userId
 */
export async function getPhotos(userId: string) {
    return sequelize.query(`
SELECT post_image.id, url
FROM post_image
         JOIN post p on post_image.postId = p.id
WHERE p.userId = '${userId}'`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
}

