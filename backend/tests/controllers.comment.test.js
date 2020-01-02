
const request = require('supertest');

const {app, server} = require('../src/app');
const {signJWT} = require("../src/helpers/JWTHelper");
const {wipeOutDatabase, createUserAndProfile} = require('./index');
const endpoints = require('../src/utils/constants/endpoints');
const {config} = require('../src/config/config');
const {CommentLike, Post, Comment} = require('../src/database/database');
const {users, profiles, posts, comments} = require('./seed');
const httpCodes = require('../src/utils/constants/httpResponseCodes');

describe('POST /createComment', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        await Post.create(posts[0]);
        accessToken = await signJWT(user.id);
    });

    it('should create a new comment with plain text', (done) => {
        request(app)
            .post(endpoints.comment.CREATE_COMMENT(comments[0].postId))
            .set(config.headers.accessToken, accessToken)
            .send(comments[0])
            .expect(httpCodes.CREATED)
            .end(async (err, _) => {
                if (err) return done(err);
                const comment = await Comment.findOne({where: {postId: comments[0].postId}});
                expect(comment.img).toBe(comments[0].img);
                expect(comment.type).toBe(comments[0].type);
                expect(comment.text).toBe(comments[0].text);
                expect(comment.likes).toBe(comments[0].likes);
                expect(comment.postId).toBe(comments[0].postId);
                expect(comment.userId).toBe(comments[0].userId);
                expect(comment.id).toBe(comments[0].id);
                done();
            });
    });
});

async function assertUnLikeOrUnDislike(err, done) {
    if (err) return done(err);
    const comment = await Comment.findByPk(comments[0].id);
    expect(comment.likesCount).toBe(comments[0].likesCount);
    expect(comment.dislikesCount).toBe(comments[0].dislikesCount);
    const commentLike = await CommentLike.findOne({
        where: {
            commentId: comments[0].id,
            userId: comments[0].userId
        }
    });
    expect(commentLike).toBeFalsy();
    done();
}

async function assertLikeOrDislike(err, done) {
    if (err) return done(err);
    const comment = await Comment.findByPk(comments[0].id);
    const commentLike = await CommentLike.findOne({
        where: {
            commentId: comments[0].id,
            userId: comments[0].userId
        }
    });
    if (commentLike.isLike) {
        expect(commentLike.isLike).toBe(true);
        expect(comment.likesCount).toBe(comments[0].likesCount + 1);
    } else {
        expect(commentLike.isLike).toBe(false);
        expect(comment.dislikesCount).toBe(comments[0].dislikesCount + 1);
    }
    done();
}

describe('POST /likeComment', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        await Post.create(posts[0]);
        await Comment.create(comments[0]);
        accessToken = await signJWT(user.id);
    });

    it('should like a comment[without like nor dislike]', (done) => {
        request(app)
            .post(endpoints.comment.LIKE_COMMENT(comments[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertLikeOrDislike(err, done));
    });

    it('should unlike a comment[with like]', async (done) => {
        await CommentLike.create({
            userId: comments[0].userId,
            commentId: comments[0].id,
            isLike: true
        });
        await Comment.upsert({
            id: comments[0].id,
            userId: comments[0].userId,
            postId: comments[0].postId,
            likesCount: comments[0].likesCount + 1
        });

        request(app)
            .delete(endpoints.comment.LIKE_COMMENT(comments[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertUnLikeOrUnDislike(err, done));
    });

    it('should dislike a comment[without like nor dislike]', (done) => {
        request(app)
            .post(endpoints.comment.DISLIKE_COMMENT(comments[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertLikeOrDislike(err, done));
    });

    it('should undislike a comment[with dislike]', async (done) => {
        await CommentLike.create({
            userId: comments[0].userId,
            commentId: comments[0].id,
            isLike: false
        });
        await Comment.upsert({
            id: comments[0].id,
            userId: comments[0].userId,
            postId: comments[0].postId,
            dislikesCount: comments[0].dislikesCount + 1
        });

        request(app)
            .delete(endpoints.comment.DISLIKE_COMMENT(comments[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertUnLikeOrUnDislike(err, done));
    });

});

afterAll((done) => {
    server.close(done);
});