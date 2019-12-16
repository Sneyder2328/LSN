const request = require('supertest');
const {app} = require('../src/app');
const {sequelize, Token, User, Profile, FriendRequest, Post, PostLike, Comment, CommentLike} = require('../src/database/database');
const {users, profiles, posts, tokens} = require('./seed');
const {config} = require('../src/config/config');

async function wipeOutDatabase() {
    const destroyOptions = {
        truncate: true,
        cascade: true
    };
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null); // Important to avoid error(see https://stackoverflow.com/questions/253849/cannot-truncate-table-because-it-is-being-referenced-by-a-foreign-key-constraint)
    await Comment.destroy(destroyOptions);
    await Post.destroy(destroyOptions);
    await Token.destroy(destroyOptions);
    await FriendRequest.destroy(destroyOptions);
    await CommentLike.destroy(destroyOptions);
    await PostLike.destroy(destroyOptions);
    await Profile.destroy(destroyOptions);
    await User.destroy(destroyOptions);
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null);
}

describe('GET /profile/:username', () => {
    beforeAll(async () => {
        await wipeOutDatabase();
        await User.create({...users[0]});
        await Profile.create({...profiles[0]});
    });
    it('should return a profile', (done) => {
        request(app)
            .get(`/profile/${users[0].username}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.username).toBe(users[0].username);
                expect(res.body.fullname).toBe(profiles[0].fullname);
                expect(res.body.description).toBe(profiles[0].description);
                expect(res.body.coverPhotoUrl).toBe(profiles[0].coverPhotoUrl);
                expect(res.body.profilePhotoUrl).toBe(profiles[0].profilePhotoUrl);
            })
            .end(done);
    });
});

describe('POST /signUp', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
    });

    it('should create a new User and Profile', (done) => {
        request(app)
            .post('/signUp')
            .send({
                ...users[0], ...profiles[0]
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers[config.headers.accessToken]).toMatch(config.regex.jwt);
                expect(res.headers[config.headers.refreshToken]).toMatch(config.regex.uuidV4);
                expect(res.body.access).toBe(true);
            })
            .end(done);
    });
});

describe('POST /createPost', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const user = await User.create({...users[0]});
        await Profile.create({...profiles[0]});
        accessToken = await user.generateAccessToken();
    });
    it('should create a new post with text', (done) => {
        request(app)
            .post('/createPost')
            .set(config.headers.accessToken, accessToken)
            .send({
                ...posts[0]
            })
            .expect(201)
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
            .post('/createPost')
            .set(config.headers.accessToken, accessToken + "fd")
            .send({
                ...posts[0]
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.message).toBe("Access token not valid");
            })
            .end(done)
    });
});

describe('GET /getPosts', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await User.create({...users[0]});
        await User.create({...users[1]});
        await Profile.create({...profiles[0]});
        await Profile.create({...profiles[1]});
        await Promise.all(posts.map((post) => Post.create({...post})));
    });

    it('should return text posts with author metadata', (done) => {
        request(app)
            .get('/getPosts')
            .expect(200)
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