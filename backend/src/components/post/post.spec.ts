import request from "supertest";
import {models} from "../../database/database";
import {createUserAndProfile, wipeOutDatabase} from "../../test/setup";
import {comments, posts, profiles, users} from "../../test/seed";
import endpoints from "../../utils/constants/endpoints";
import httpCodes from "../../utils/constants/httpResponseCodes";
import {app, server} from "../../index";
import {signJWT} from "../../helpers/JWTHelper";
import config from "../../config/config";

import {LIMIT_COMMENTS_PER_POST} from "../../utils/constants";
const {User, Profile, Post, PostLike, Comment} = models;

describe('POST /createPost', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        accessToken = await signJWT(user.id);
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

describe('GET /posts', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        // @ts-ignore
        await Promise.all(users.slice(1).map((user) => User.create(user)));
        await Promise.all(profiles.slice(1).map((profile) => Profile.create(profile)));
        await Promise.all(posts.map((post) => Post.create(post)));
        accessToken = await signJWT(user.id);
    });

    it('should return text posts with author metadata', (done) => {
        request(app)
            .get(endpoints.post.GET_POSTS)
            .set(config.headers.accessToken, accessToken)
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
        await Promise.all(comments.map((comment) => Comment.create(comment)));

        request(app)
            .get(endpoints.post.GET_POSTS)
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.body.length).toBe(posts.length);
                res.body.forEach(post => {
                    console.log('post=', post);

                    expect(post.id).toBeTruthy();
                    expect(post.userId).toBeTruthy();
                    expect(post.text).toBeTruthy();
                    expect(post.img).toBeFalsy();
                    expect(post.createdAt).toBeTruthy();
                    expect(post.likesCount).toBe(0);
                    expect(post.type).toBe('text');
                    const expectedCommentsCount = comments.filter(comment => comment.postId === post.id).length;
                    expect(post.commentsCount).toBe(expectedCommentsCount);
                    const expectedCommentsFetched = expectedCommentsCount < LIMIT_COMMENTS_PER_POST ? expectedCommentsCount : LIMIT_COMMENTS_PER_POST;
                    expect(post.comments.length).toBe(expectedCommentsFetched);
                    post.comments.forEach(comment => {
                        expect(comment.text).toBe(comments.find(it => it.id === comment.id)!.text);
                        expect(comment.postId).toBe(comments.find(it => it.id === comment.id)!.postId);
                        expect(comment.type).toBe(comments.find(it => it.id === comment.id)!.type);
                        const commentCreatorUserProfile = profiles.find(it => it.userId === comment.userId)!;
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
    });
});

async function assertUnLikeOrUnDislike(err, done) {
    if (err) return done(err);
    const post = await Post.findByPk(posts[0].id);
    expect(post.likesCount).toBe(posts[0].likesCount);
    expect(post.dislikesCount).toBe(posts[0].dislikesCount);
    // @ts-ignore
    const postLike = await PostLike.findOne({where: {postId: posts[0].id, userId: posts[0].userId}});
    expect(postLike).toBeFalsy();
    done();
}

async function assertLikeOrDislike(err, done) {
    if (err) return done(err);
    const post = await Post.findByPk(posts[0].id);
    // @ts-ignore
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

describe('POST /posts/likes', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        accessToken = await signJWT(user.id);
        await Post.create(posts[0]);
    });

    it('should like a post[without like nor dislike]', (done) => {
        request(app)
            .post(endpoints.post.LIKE_POST(posts[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertLikeOrDislike(err, done));
    });
});

describe('DELETE /posts/likes', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        accessToken = await signJWT(user.id);
        await Post.create(posts[0]);
    });

    it('should unlike a post[with like]', async (done) => {
        // @ts-ignore
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
});

describe('POST /posts/dislikes', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        accessToken = await signJWT(user.id);
        await Post.create(posts[0]);
    });

    it('should dislike a post[without like nor dislike]', (done) => {
        request(app)
            .post(endpoints.post.DISLIKE_POST(posts[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertLikeOrDislike(err, done));
    });
});

describe('DELETE /posts/dislikes', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        accessToken = await signJWT(user.id);
        await Post.create(posts[0]);
    });

    it('should undislike a post[with dislike]', async (done) => {
        // @ts-ignore
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