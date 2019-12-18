const request = require('supertest');

const {app, server} = require('../src/app');
const httpCodes = require('../src/utils/constants/httpResponseCodes');
const error = require('../src/utils/constants/errors');
const endpoints = require('../src/utils/constants/endpoints');
const {config} = require('../src/config/config');
const {genUUID} = require('../src/utils/utils');
const {wipeOutDatabase, createUserAndProfile} = require('./index');
const {FriendRequest} = require('../src/database/database');
const {users, profiles} = require('./seed');

describe('GET /profile/:username', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await createUserAndProfile({...users[0]}, {...profiles[0]});
    });
    it('should return a profile', (done) => {
        request(app)
            .get(endpoints.user.GET_PROFILE(users[0].username))
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.body.username).toBe(users[0].username);
                expect(res.body.fullname).toBe(profiles[0].fullname);
                expect(res.body.description).toBe(profiles[0].description);
                expect(res.body.coverPhotoUrl).toBe(profiles[0].coverPhotoUrl);
                expect(res.body.profilePhotoUrl).toBe(profiles[0].profilePhotoUrl);
            })
            .end(done);
    });

    it('should not return a profile', (done) => {
        request(app)
            .get(endpoints.user.GET_PROFILE(users[1].username))
            .expect(httpCodes.NOT_FOUND)
            .expect((res) => {
                expect(res.body.error).toBe(error.USER_NOT_FOUND_ERROR);
                expect(res.body.message).toBe(error.USER_NOT_FOUND_ERROR);
            })
            .end(done);
    });
});

describe('POST /sendFriendRequest', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile({...users[0]}, {...profiles[0]});
        await createUserAndProfile({...users[1]}, {...profiles[1]});
        accessToken = await user.generateAccessToken();
    });

    it('should send a friend request', (done) => {
        request(app)
            .post(endpoints.user.SEND_FRIEND_REQUEST)
            .set(config.headers.accessToken, accessToken)
            .send({
                senderId: users[0].id,
                receiverId: users[1].id
            })
            .expect(httpCodes.CREATED)
            .end(done);
    });

    it('should not send a friend request on other user"s behalf', (done) => {
        request(app)
            .post(endpoints.user.SEND_FRIEND_REQUEST)
            .set(config.headers.accessToken, accessToken)
            .send({
                senderId: users[1].id,
                receiverId: users[0].id
            })
            .expect(httpCodes.UNAUTHORIZED)
            .expect((res) => {
                expect(res.body.error).toBe(error.AUTH_ERROR);
            })
            .end(done);
    });

    describe("should get user's friend requests", () => {
        let accessToken;
        beforeEach(async () => {
            const {user} = await createUserAndProfile({...users[2]}, {...profiles[2]});
            accessToken = await user.generateAccessToken();
            await FriendRequest.create({id: genUUID(), senderId: users[0].id, receiverId: users[2].id});
            await FriendRequest.create({id: genUUID(), senderId: users[1].id, receiverId: users[2].id});
        });

        it("should get user's friend requests", (done) => {
            request(app)
                .get(endpoints.user.GET_FRIEND_REQUESTS(users[2].id))
                .set(config.headers.accessToken, accessToken)
                .expect(httpCodes.OK)
                .expect((res) => {
                    console.log("friend requests =  ", res.body);
                    expect(res.body.length).toBe(2);
                })
                .end(done);
        });

        it("should not get other user's friend requests", (done) => {
            request(app)
                .get(endpoints.user.GET_FRIEND_REQUESTS(users[0].id))
                .set(config.headers.accessToken, accessToken)
                .expect(httpCodes.UNAUTHORIZED)
                .expect((res) => {
                    expect(res.body.error).toBe(error.AUTH_ERROR);
                })
                .end(done);
        });
    });
});

afterAll((done) => {
    server.close(done);
});