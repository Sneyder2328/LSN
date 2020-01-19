import * as sequelize from "sequelize";
import Token0 from "./Token";
import User0 from "./User";
import Profile0 from "./Profile";
import UserRelationship from "./UserRelationship";
import Post0 from "./Post";
import PostLike0 from "./PostLike";
import Comment0 from "./Comment";
import CommentLike0 from "./CommentLike";
import PostImage0 from "./PostImage";

export default function (sequelize: sequelize.Sequelize, Sequelize) {
    const User = User0(sequelize, Sequelize);
    const Token = Token0(sequelize, Sequelize, User);
    const Profile = Profile0(sequelize, Sequelize, User);
    const UserRelationShip = UserRelationship(sequelize, Sequelize);
    const Post = Post0(sequelize, Sequelize, User);
    const PostLike = PostLike0(sequelize, Sequelize, User, Post);
    const PostImage = PostImage0(sequelize, Sequelize, Post);
    const Comment = Comment0(sequelize, Sequelize, User, Post);
    const CommentLike = CommentLike0(sequelize, Sequelize, User, Comment);

    return {Token, User, Profile, UserRelationShip, Post, PostLike, PostImage, Comment, CommentLike}
};