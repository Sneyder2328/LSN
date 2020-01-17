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
const database_1 = require("../../database/database");
const setup_1 = require("../../test/setup");
const seed_1 = require("../../test/seed");
const endpoints_1 = __importDefault(require("../../utils/constants/endpoints"));
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const index_1 = require("../../index");
const JWTHelper_1 = require("../../helpers/JWTHelper");
const config_1 = __importDefault(require("../../config/config"));
const constants_1 = require("../../utils/constants");
const { User, Profile, Post, PostLike, Comment } = database_1.models;
describe('POST /createPost', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
    }));
    it('should create a new post with text', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.post.CREATE_POST)
            .set(config_1.default.headers.accessToken, accessToken)
            .send(seed_1.posts[0])
            .expect(httpResponseCodes_1.default.CREATED)
            .expect((res) => {
            expect(res.body.commentsCount).toBe(0);
            expect(res.body.likesCount).toBe(0);
            expect(res.body.type).toBe(seed_1.posts[0].type);
            expect(res.body.text).toBe(seed_1.posts[0].text);
            expect(res.body.id).toBeTruthy();
            expect(res.body.img).toBe(seed_1.posts[0].img);
            expect(res.body.createdAt).toBeTruthy();
        })
            .end(done);
    });
    it('should not create a new post for an unauthenticated user', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.post.CREATE_POST)
            .set(config_1.default.headers.accessToken, accessToken + "fd")
            .send(seed_1.posts[0])
            .expect(httpResponseCodes_1.default.UNAUTHORIZED)
            .expect((res) => {
            expect(res.body.message).toBe("Access token not valid");
        })
            .end(done);
    });
});
describe('GET /posts', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        // @ts-ignore
        yield Promise.all(seed_1.users.slice(1).map((user) => User.create(user)));
        yield Promise.all(seed_1.profiles.slice(1).map((profile) => Profile.create(profile)));
        yield Promise.all(seed_1.posts.map((post) => Post.create(post)));
        accessToken = yield JWTHelper_1.signJWT(user.id);
    }));
    it('should return text posts with author metadata', (done) => {
        supertest_1.default(index_1.app)
            .get(endpoints_1.default.post.GET_POSTS)
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.body.length).toBe(seed_1.posts.length);
            res.body.forEach(post => {
                expect(post.id).toBeTruthy();
                expect(post.userId).toBeTruthy();
                expect(post.text).toBeTruthy();
                expect(post.img).toBeFalsy();
                expect(post.createdAt).toBeTruthy();
                expect(post.commentsCount).toBe(0);
                expect(post.likesCount).toBe(0);
                expect(post.type).toBe('text');
                expect(post.authorProfile.userId).toBeTruthy();
                expect(post.authorProfile.username).toBeTruthy();
                expect(post.authorProfile.fullname).toBeTruthy();
                expect(post.authorProfile.description).toBeTruthy();
            });
        })
            .end(done);
    });
    it('should return text posts with comments', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(seed_1.comments.map((comment) => Comment.create(comment)));
        supertest_1.default(index_1.app)
            .get(endpoints_1.default.post.GET_POSTS)
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.body.length).toBe(seed_1.posts.length);
            res.body.forEach(post => {
                console.log('post=', post);
                expect(post.id).toBeTruthy();
                expect(post.userId).toBeTruthy();
                expect(post.text).toBeTruthy();
                expect(post.img).toBeFalsy();
                expect(post.createdAt).toBeTruthy();
                expect(post.likesCount).toBe(0);
                expect(post.type).toBe('text');
                const expectedCommentsCount = seed_1.comments.filter(comment => comment.postId === post.id).length;
                expect(post.commentsCount).toBe(expectedCommentsCount);
                const expectedCommentsFetched = expectedCommentsCount < constants_1.LIMIT_COMMENTS_PER_POST ? expectedCommentsCount : constants_1.LIMIT_COMMENTS_PER_POST;
                expect(post.comments.length).toBe(expectedCommentsFetched);
                post.comments.forEach(comment => {
                    expect(comment.text).toBe(seed_1.comments.find(it => it.id === comment.id).text);
                    expect(comment.postId).toBe(seed_1.comments.find(it => it.id === comment.id).postId);
                    expect(comment.type).toBe(seed_1.comments.find(it => it.id === comment.id).type);
                    const commentCreatorUserProfile = seed_1.profiles.find(it => it.userId === comment.userId);
                    expect(comment.authorProfile).toBeDefined();
                    expect(comment.authorProfile.username).toBe(commentCreatorUserProfile.username);
                    expect(comment.authorProfile.fullname).toBe(commentCreatorUserProfile.fullname);
                    expect(comment.authorProfile.description).toBe(commentCreatorUserProfile.description);
                    expect(comment.authorProfile.profilePhotoUrl).toBe(commentCreatorUserProfile.profilePhotoUrl);
                    expect(comment.authorProfile.coverPhotoUrl).toBe(commentCreatorUserProfile.coverPhotoUrl);
                });
            });
        })
            .end(done);
    }));
});
function assertUnLikeOrUnDislike(err, done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (err)
            return done(err);
        const post = yield Post.findByPk(seed_1.posts[0].id);
        expect(post.likesCount).toBe(seed_1.posts[0].likesCount);
        expect(post.dislikesCount).toBe(seed_1.posts[0].dislikesCount);
        // @ts-ignore
        const postLike = yield PostLike.findOne({ where: { postId: seed_1.posts[0].id, userId: seed_1.posts[0].userId } });
        expect(postLike).toBeFalsy();
        done();
    });
}
function assertLikeOrDislike(err, done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (err)
            return done(err);
        const post = yield Post.findByPk(seed_1.posts[0].id);
        // @ts-ignore
        const postLike = yield PostLike.findOne({
            where: {
                postId: seed_1.posts[0].id,
                userId: seed_1.posts[0].userId
            }
        });
        if (postLike.isLike) {
            expect(postLike.isLike).toBe(true);
            expect(post.likesCount).toBe(seed_1.posts[0].likesCount + 1);
        }
        else {
            expect(postLike.isLike).toBe(false);
            expect(post.dislikesCount).toBe(seed_1.posts[0].dislikesCount + 1);
        }
        done();
    });
}
describe('POST /posts/likes', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
        yield Post.create(seed_1.posts[0]);
    }));
    it('should like a post[without like nor dislike]', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.post.LIKE_POST(seed_1.posts[0].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () { return yield assertLikeOrDislike(err, done); }));
    });
});
describe('DELETE /posts/likes', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
        yield Post.create(seed_1.posts[0]);
    }));
    it('should unlike a post[with like]', (done) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        yield PostLike.create({
            userId: seed_1.posts[0].userId,
            postId: seed_1.posts[0].id,
            isLike: true
        });
        yield Post.upsert({ id: seed_1.posts[0].id, userId: seed_1.posts[0].userId, likesCount: seed_1.posts[0].likesCount + 1 });
        supertest_1.default(index_1.app)
            .delete(endpoints_1.default.post.LIKE_POST(seed_1.posts[0].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () { return yield assertUnLikeOrUnDislike(err, done); }));
    }));
});
describe('POST /posts/dislikes', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
        yield Post.create(seed_1.posts[0]);
    }));
    it('should dislike a post[without like nor dislike]', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.post.DISLIKE_POST(seed_1.posts[0].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () { return yield assertLikeOrDislike(err, done); }));
    });
});
describe('DELETE /posts/dislikes', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        accessToken = yield JWTHelper_1.signJWT(user.id);
        yield Post.create(seed_1.posts[0]);
    }));
    it('should undislike a post[with dislike]', (done) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        yield PostLike.create({
            userId: seed_1.posts[0].userId,
            postId: seed_1.posts[0].id,
            isLike: false
        });
        yield Post.upsert({ id: seed_1.posts[0].id, userId: seed_1.posts[0].userId, dislikesCount: seed_1.posts[0].dislikesCount + 1 });
        supertest_1.default(index_1.app)
            .delete(endpoints_1.default.post.DISLIKE_POST(seed_1.posts[0].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () { return yield assertUnLikeOrUnDislike(err, done); }));
    }));
});
afterAll((done) => {
    index_1.server.close(done);
});
