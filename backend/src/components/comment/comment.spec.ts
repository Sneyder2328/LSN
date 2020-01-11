import request from "supertest";
import {signJWT} from "../../helpers/JWTHelper";
import {app, server} from "../../index";
import {createUserAndProfile, wipeOutDatabase} from "../../test/setup";
import endpoints from "../../utils/constants/endpoints";
import config from "../../config/config";
import {models} from "../../database/database";
const {Comment, CommentLike, Post} = models;
import {comments, posts, profiles, users} from "../../test/seed";
import httpCodes from "../../utils/constants/httpResponseCodes";

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
                expect(comment.likesCount).toBe(comments[0].likesCount);
                expect(comment.postId).toBe(comments[0].postId);
                expect(comment.userId).toBe(comments[0].userId);
                expect(comment.id).toBe(comments[0].id);
                done();
            });
    });
});


describe('GET /posts/:postId/comments', () => {
    let accessToken, commentsToFetch;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users.find(it => it.id === posts[2].userId), profiles.find(it => it.userId === posts[2].userId));
        accessToken = await signJWT(user.id);
        await Post.create(posts[2]);
        commentsToFetch = comments.filter(comment => comment.postId === posts[2].id);
        await Promise.all(commentsToFetch.map(it => Comment.create(it)));
    });

    it('should get comments with offset[3] and limit[10] from post', (done) => {
        request(app)
            .get(endpoints.comment.GET_COMMENTS(posts[2].id) + '?offset=3&limit=10')
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.body.length).toBe(10);
            })
            .end(done);
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

describe('POST /comments/likes', () => {
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
});

describe('DELETE /comments/likes', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        await Post.create(posts[0]);
        await Comment.create(comments[0]);
        accessToken = await signJWT(user.id);
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
    });

    it('should unlike a comment[with like]', (done) => {
        request(app)
            .delete(endpoints.comment.LIKE_COMMENT(comments[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertUnLikeOrUnDislike(err, done));
    });
});

describe('POST /comments/dislikes', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        await Post.create(posts[0]);
        await Comment.create(comments[0]);
        accessToken = await signJWT(user.id);
    });

    it('should dislike a comment[without like nor dislike]', (done) => {
        request(app)
            .post(endpoints.comment.DISLIKE_COMMENT(comments[0].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => await assertLikeOrDislike(err, done));
    });
});

describe('DELETE /comments/dislikes', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile(users[0], profiles[0]);
        await Post.create(posts[0]);
        await Comment.create(comments[0]);
        accessToken = await signJWT(user.id);
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
    });

    it('should undislike a comment[with dislike]', async (done) => {
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