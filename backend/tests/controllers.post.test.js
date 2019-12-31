const request = require('supertest');

const {app, server} = require('../src/app');
const httpCodes = require('../src/utils/constants/httpResponseCodes');
const endpoints = require('../src/utils/constants/endpoints');
const {users, profiles, posts, comments} = require('./seed');
const {wipeOutDatabase, createUserAndProfile} = require('./index');
const {User, Profile, Post, PostLike, Comment} = require('../src/database/database');
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
                expect(res.body.commentsCount).toBe(0);
                expect(res.body.likesCount).toBe(0);
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

    it('should return text posts with comments', async (done) => {
        await Comment.create(comments[0]);
        await Comment.create(comments[1]);

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
                    expect(post.likesCount).toBe(0);
                    expect(post.type).toBe('text');
                    if (post.id === posts[0].id) {
                        expect(post.commentsCount).toBe(2);
                        expect(post.comments.length).toBe(2);
                    }
                });
            })
            .end(done);
    });
});

async function assertUnLikeOrUnDislike(err, done) {
    if (err) return done(err);
    const post = await Post.findByPk(posts[0].id);
    expect(post.likesCount).toBe(posts[0].likesCount);
    expect(post.dislikesCount).toBe(posts[0].dislikesCount);
    const postLike = await PostLike.findOne({where: {postId: posts[0].id, userId: posts[0].userId}});
    expect(postLike).toBeFalsy();
    done();
}

async function assertLikeOrDislike(err, done) {
    if (err) return done(err);
    const post = await Post.findByPk(posts[0].id);
    const postLike = await PostLike.findOne({
        where: {
            postId: posts[0].id,
            userId: posts[0].userId
        }
    });
    if (postLike.isLike) {
        expect(postLike.isLike).toBe(true);
        expect(post.likesCount).toBe(posts[0].likesCount + 1);
    } else {
        expect(postLike.isLike).toBe(false);
        expect(post.dislikesCount).toBe(posts[0].dislikesCount + 1);
    }
    done();
}

describe('POST /likePost', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        accessToken = await user.generateAccessToken();
        await Post.create(posts[0]);
    });

    it('should like a post[without like nor dislike]', (done) => {
        request(app)
            .post(endpoints.post.LIKE_POST(posts[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertLikeOrDislike(err, done));
    });

    it('should unlike a post[with like]', async (done) => {
        await PostLike.create({
            userId: posts[0].userId,
            postId: posts[0].id,
            isLike: true
        });
        await Post.upsert({id: posts[0].id, userId: posts[0].userId, likesCount: posts[0].likesCount + 1});

        request(app)
            .delete(endpoints.post.LIKE_POST(posts[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertUnLikeOrUnDislike(err, done));
    });

    it('should dislike a post[without like nor dislike]', (done) => {
        request(app)
            .post(endpoints.post.DISLIKE_POST(posts[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertLikeOrDislike(err, done));
    });

    it('should undislike a post[with dislike]', async (done) => {
        await PostLike.create({
            userId: posts[0].userId,
            postId: posts[0].id,
            isLike: false
        });
        await Post.upsert({id: posts[0].id, userId: posts[0].userId, dislikesCount: posts[0].dislikesCount + 1});

        request(app)
            .delete(endpoints.post.DISLIKE_POST(posts[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertUnLikeOrUnDislike(err, done));
    });
});

afterAll((done) => {
    server.close(done);
});