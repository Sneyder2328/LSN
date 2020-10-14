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
const supertest_1 = __importDefault(require("supertest"));
const JWTHelper_1 = require("../../helpers/JWTHelper");
const index_1 = require("../../index");
const setup_1 = require("../../test/setup");
const endpoints_1 = __importDefault(require("../../utils/constants/endpoints"));
const config_1 = __importDefault(require("../../config/config"));
const database_1 = require("../../database/database");
const { Comment, CommentLike, Post } = database_1.models;
const seed_1 = require("../../test/seed");
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
describe('POST /posts/:postId/comments', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        yield Post.create(seed_1.posts[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
    }));
    it('should create a new comment with plain text', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.comment.CREATE_COMMENT(seed_1.comments[0].postId))
            .set(config_1.default.headers.accessToken, accessToken)
            .send(seed_1.comments[0])
            .expect(httpResponseCodes_1.default.CREATED)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return done(err);
            const comment = yield Comment.findOne({ where: { postId: seed_1.comments[0].postId } });
            expect(comment.img).toBe(seed_1.comments[0].img);
            expect(comment.type).toBe(seed_1.comments[0].type);
            expect(comment.text).toBe(seed_1.comments[0].text);
            expect(comment.likesCount).toBe(seed_1.comments[0].likesCount);
            expect(comment.postId).toBe(seed_1.comments[0].postId);
            expect(comment.userId).toBe(seed_1.comments[0].userId);
            expect(comment.id).toBe(seed_1.comments[0].id);
            done();
        }));
    });
});
describe('GET /posts/:postId/comments', () => {
    let accessToken, commentsToFetch;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users.find(it => it.id === seed_1.posts[2].userId), seed_1.profiles.find(it => it.userId === seed_1.posts[2].userId));
        accessToken = yield JWTHelper_1.signJWT(user.id);
        yield Post.create(seed_1.posts[2]);
        commentsToFetch = seed_1.comments.filter(comment => comment.postId === seed_1.posts[2].id);
        yield Promise.all(commentsToFetch.map(it => Comment.create(it)));
    }));
    it('should get comments with offset[3] and limit[10] from post', (done) => {
        supertest_1.default(index_1.app)
            .get(endpoints_1.default.comment.GET_COMMENTS(seed_1.posts[2].id) + '?offset=3&limit=10')
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.body.length).toBe(10);
        })
            .end(done);
    });
});
function assertUnLikeOrUnDislike(err, done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (err)
            return done(err);
        const comment = yield Comment.findByPk(seed_1.comments[0].id);
        expect(comment.likesCount).toBe(seed_1.comments[0].likesCount);
        expect(comment.dislikesCount).toBe(seed_1.comments[0].dislikesCount);
        const commentLike = yield CommentLike.findOne({
            where: {
                commentId: seed_1.comments[0].id,
                userId: seed_1.comments[0].userId
            }
        });
        expect(commentLike).toBeFalsy();
        done();
    });
}
function assertLikeOrDislike(err, done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (err)
            return done(err);
        const comment = yield Comment.findByPk(seed_1.comments[0].id);
        const commentLike = yield CommentLike.findOne({
            where: {
                commentId: seed_1.comments[0].id,
                userId: seed_1.comments[0].userId
            }
        });
        if (commentLike.isLike) {
            expect(commentLike.isLike).toBe(true);
            expect(comment.likesCount).toBe(seed_1.comments[0].likesCount + 1);
        }
        else {
            expect(commentLike.isLike).toBe(false);
            expect(comment.dislikesCount).toBe(seed_1.comments[0].dislikesCount + 1);
        }
        done();
    });
}
describe('POST /comments/likes', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        yield Post.create(seed_1.posts[0]);
        yield Comment.create(seed_1.comments[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
    }));
    it('should like a comment[without like nor dislike]', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.comment.LIKE_COMMENT(seed_1.comments[0].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () { return yield assertLikeOrDislike(err, done); }));
    });
});
describe('DELETE /comments/likes', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        yield Post.create(seed_1.posts[0]);
        yield Comment.create(seed_1.comments[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
        yield CommentLike.create({
            userId: seed_1.comments[0].userId,
            commentId: seed_1.comments[0].id,
            isLike: true
        });
        yield Comment.upsert({
            id: seed_1.comments[0].id,
            userId: seed_1.comments[0].userId,
            postId: seed_1.comments[0].postId,
            likesCount: seed_1.comments[0].likesCount + 1
        });
    }));
    it('should unlike a comment[with like]', (done) => {
        supertest_1.default(index_1.app)
            .delete(endpoints_1.default.comment.LIKE_COMMENT(seed_1.comments[0].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () { return yield assertUnLikeOrUnDislike(err, done); }));
    });
});
describe('POST /comments/dislikes', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        yield Post.create(seed_1.posts[0]);
        yield Comment.create(seed_1.comments[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
    }));
    it('should dislike a comment[without like nor dislike]', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.comment.DISLIKE_COMMENT(seed_1.comments[0].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () { return yield assertLikeOrDislike(err, done); }));
    });
});
describe('DELETE /comments/dislikes', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        yield Post.create(seed_1.posts[0]);
        yield Comment.create(seed_1.comments[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
        yield CommentLike.create({
            userId: seed_1.comments[0].userId,
            commentId: seed_1.comments[0].id,
            isLike: false
        });
        yield Comment.upsert({
            id: seed_1.comments[0].id,
            userId: seed_1.comments[0].userId,
            postId: seed_1.comments[0].postId,
            dislikesCount: seed_1.comments[0].dislikesCount + 1
        });
    }));
    it('should undislike a comment[with dislike]', (done) => __awaiter(void 0, void 0, void 0, function* () {
        supertest_1.default(index_1.app)
            .delete(endpoints_1.default.comment.DISLIKE_COMMENT(seed_1.comments[0].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () { return yield assertUnLikeOrUnDislike(err, done); }));
    }));
});
afterAll((done) => {
    index_1.server.close(done);
});
