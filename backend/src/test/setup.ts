import uuid from "uuid";
import {models, sequelize} from "../database/database";

const {
    Comment,
    CommentLike,
    Post,
    PostLike,
    Profile,
    Token,
    User,
    UserRelationShip
} = models;

export async function wipeOutDatabase() {
    const destroyOptions = {
        truncate: true,
        cascade: true
    };
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', undefined); // Important to avoid error(see https://stackoverflow.com/questions/253849/cannot-truncate-table-because-it-is-being-referenced-by-a-foreign-key-constraint)
    await Comment.destroy(destroyOptions);
    await Post.destroy(destroyOptions);
    await Token.destroy(destroyOptions);
    await UserRelationShip.destroy(destroyOptions);
    await CommentLike.destroy(destroyOptions);
    await PostLike.destroy(destroyOptions);
    await Profile.destroy(destroyOptions);
    await User.destroy(destroyOptions);
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', undefined);
}

export async function createUserAndProfile(userData, profileData, includeRefreshToken = false) {
    // @ts-ignore
    const user = await User.create(userData);
    const profile = await Profile.create(profileData);
    if (includeRefreshToken) {
        const token = await Token.create({userId: userData.id, token: uuid.v4()});
        return {user, profile, token};
    }
    return {user, profile};
}