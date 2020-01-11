"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const database_1 = require("../database/database");
const { Comment, CommentLike, Post, PostLike, Profile, Token, User, UserRelationShip } = database_1.models;
function wipeOutDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const destroyOptions = {
            truncate: true,
            cascade: true
        };
        yield database_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', undefined); // Important to avoid error(see https://stackoverflow.com/questions/253849/cannot-truncate-table-because-it-is-being-referenced-by-a-foreign-key-constraint)
        yield Comment.destroy(destroyOptions);
        yield Post.destroy(destroyOptions);
        yield Token.destroy(destroyOptions);
        yield UserRelationShip.destroy(destroyOptions);
        yield CommentLike.destroy(destroyOptions);
        yield PostLike.destroy(destroyOptions);
        yield Profile.destroy(destroyOptions);
        yield User.destroy(destroyOptions);
        yield database_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', undefined);
    });
}
exports.wipeOutDatabase = wipeOutDatabase;
function createUserAndProfile(userData, profileData, includeRefreshToken = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const user = yield User.create(userData);
        const profile = yield Profile.create(profileData);
        if (includeRefreshToken) {
            const token = yield Token.create({ userId: userData.id, token: uuid_1.default.v4() });
            return { user, profile, token };
        }
        return { user, profile };
    });
}
exports.createUserAndProfile = createUserAndProfile;
