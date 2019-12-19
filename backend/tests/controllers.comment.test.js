const request = require('supertest');

const {app, server} = require('../src/app');
const {wipeOutDatabase, createUserAndProfile} = require('./index');
const endpoints = require('../src/utils/constants/endpoints');
const {config} = require('../src/config/config');
const {User, Profile, Post, Comment} = require('../src/database/database');
const {users, profiles, posts, comments} = require('./seed');
const httpCodes = require('../src/utils/constants/httpResponseCodes');

describe('POST /createComment', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        await Post.create(posts[0]);
        accessToken = await user.generateAccessToken();
    });

    it('should create a new comment with plain text', (done) => {
        request(app)
            .post(endpoints.comment.CREATE_COMMENT)
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

describe('POST /likeComment', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        await Post.create(posts[0]);
        await Comment.create(comments[0]);
        accessToken = await user.generateAccessToken();
    });

    it('should like a comment', (done) => {
        request(app)
            .post(endpoints.comment.LIKE_COMMENT)
            .set(config.headers.accessToken, accessToken)
            .send({commentId: comments[0].id})
            .expect(httpCodes.OK)
            .end(async (err, _) => {
                if (err) return done(err);
                const comment = await Comment.findOne({where: {id: comments[0].id}});
                console.log("comment=", comment);
                expect(comment.likes).toBe(comments[0].likes+1);
                done();
            });
    });
});

afterAll((done) => {
    server.close(done);
});