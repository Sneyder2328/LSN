const request = require('supertest');

const {app, server} = require('../src/app');
const httpCodes = require('../src/utils/constants/httpResponseCodes');
const endpoints = require('../src/utils/constants/endpoints');
const {users, profiles, posts} = require('./seed');
const {wipeOutDatabase, createUserAndProfile} = require('./index');
const {User, Profile, Post} = require('../src/database/database');
const {config} = require('../src/config/config');

describe('POST /createPost', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        accessToken = await user.generateAccessToken();
    });

    it('should create a new post with text', (done) => {
        request(app)
            .post(endpoints.post.CREATE_POST)
            .set(config.headers.accessToken, accessToken)
            .send(posts[0])
            .expect(httpCodes.CREATED)
            .expect((res) => {
                expect(res.body.comments).toBe(0);
                expect(res.body.likes).toBe(0);
                expect(res.body.type).toBe(posts[0].type);
                expect(res.body.text).toBe(posts[0].text);
                expect(res.body.id).toBeTruthy();
                expect(res.body.img).toBe(posts[0].img);
                expect(res.body.createdAt).toBeTruthy();
            })
            .end(done)
    });

    it('should not create a new post for an unauthenticated user', (done) => {
        request(app)
            .post(endpoints.post.CREATE_POST)
            .set(config.headers.accessToken, accessToken + "fd")
            .send(posts[0])
            .expect(httpCodes.UNAUTHORIZED)
            .expect((res) => {
                expect(res.body.message).toBe("Access token not valid");
            })
            .end(done)
    });
});

describe('GET /getPosts', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await User.create(users[0]);
        await User.create(users[1]);
        await Profile.create(profiles[0]);
        await Profile.create(profiles[1]);
        await Promise.all(posts.map((post) => Post.create(post)));
    });

    it('should return text posts with author metadata', (done) => {
        request(app)
            .get(endpoints.post.GET_POSTS)
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.body.length).toBe(posts.length);
                res.body.forEach(post => {
                    expect(post.id).toBeTruthy();
                    expect(post.userId).toBeTruthy();
                    expect(post.text).toBeTruthy();
                    expect(post.img).toBeFalsy();
                    expect(post.createdAt).toBeTruthy();
                    expect(post.comments).toBe(0);
                    expect(post.likes).toBe(0);
                    expect(post.type).toBe('text');
                    expect(post.Profile.userId).toBeTruthy();
                    expect(post.Profile.username).toBeTruthy();
                    expect(post.Profile.fullname).toBeTruthy();
                    expect(post.Profile.description).toBeTruthy();
                });
            })
            .end(done);
    });
});

describe('POST /likePost', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        accessToken = await user.generateAccessToken();
        await Post.create(posts[0]);
    });

    it('should like a post', (done) => {
        request(app)
            .post(endpoints.post.LIKE_POST)
            .set(config.headers.accessToken, accessToken)
            .send({postId: posts[0].id})
            .expect(httpCodes.OK)
            .end(async (err, _) => {
                if (err) return done(err);
                const post = (await Post.findOne({where: {id: posts[0].id}})).dataValues;
                expect(post.likes).toBe(posts[0].likes+1);
                done();
            });
    });
});

afterAll((done) => {
    server.close(done);
});