import {models} from "../../database/database";
import {UserNotFoundError} from "../../utils/errors/UserNotFoundError";
import userRelationship from "../../utils/constants/userRelationship";
import {Op} from "sequelize";
import {compareByDateAsc} from "../../utils/utils";

const {Post} = models;

const {Profile, UserRelationShip} = models;

const includePostsSorted = [
    {
        model: Post,
        as: 'posts'
    }
];

export async function getProfileByUsername(username, includePosts?: boolean) {
    let user;
    if (includePosts === true) {
        user = await Profile.findOne({where: {username}, include: includePostsSorted});
        user = user.toJSON();
        user.posts = user.posts.sort(compareByDateAsc);
    } else {
        user = await Profile.findOne({where: {username}});
    }
    if (!user) throw new UserNotFoundError();
    return user;
}

export async function getProfileByUserId(userId, includePosts?: boolean) {
    let user;
    if (includePosts === true) {
        user = await Profile.findByPk(userId, {include: includePostsSorted});
        user = user.toJSON();
        user.posts = user.posts.sort(compareByDateAsc);
    } else {
        user = await Profile.findByPk(userId);
    }
    if (!user) throw new UserNotFoundError();
    return user;
}

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

export async function sendFriendRequest(senderId, receiverId) {
    const fRequest = await UserRelationShip.create({senderId, receiverId, type: userRelationship.PENDING});
    return fRequest !== null;
}

export async function getFriendRequests(userId) {
    return UserRelationShip.findAll({where: {receiverId: userId, type: userRelationship.PENDING}});
}

export async function handleFriendRequest(receiverId, senderId, action) {
    if (action === 'confirm') {
        return UserRelationShip.update({type: userRelationship.FRIEND}, {where: {receiverId, senderId}});
    }
    return UserRelationShip.destroy({where: {receiverId, senderId}});
}