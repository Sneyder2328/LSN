"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = __importDefault(require("./Token"));
const User_1 = __importDefault(require("./User"));
const Profile_1 = __importDefault(require("./Profile"));
const UserRelationship_1 = __importDefault(require("./UserRelationship"));
const Post_1 = __importDefault(require("./Post"));
const PostLike_1 = __importDefault(require("./PostLike"));
const Comment_1 = __importDefault(require("./Comment"));
const CommentLike_1 = __importDefault(require("./CommentLike"));
const PostImage_1 = __importDefault(require("./PostImage"));
function default_1(sequelize, Sequelize) {
    const User = User_1.default(sequelize, Sequelize);
    const Token = Token_1.default(sequelize, Sequelize, User);
    const Profile = Profile_1.default(sequelize, Sequelize, User);
    const UserRelationShip = UserRelationship_1.default(sequelize, Sequelize);
    const Post = Post_1.default(sequelize, Sequelize, User);
    const PostLike = PostLike_1.default(sequelize, Sequelize, User, Post);
    const PostImage = PostImage_1.default(sequelize, Sequelize, Post);
    const Comment = Comment_1.default(sequelize, Sequelize, User, Post);
    const CommentLike = CommentLike_1.default(sequelize, Sequelize, User, Comment);
    return { Token, User, Profile, UserRelationShip, Post, PostLike, PostImage, Comment, CommentLike };
}
exports.default = default_1;
;
