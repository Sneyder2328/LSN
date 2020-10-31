import request from "supertest";
import {signJWT} from "../../helpers/JWTHelper";
import {app, server} from "../../index";
import {createUserAndProfile, wipeOutDatabase} from "../../test/setup";
import httpCodes from "../../utils/constants/httpResponseCodes";
import error from "../../utils/constants/errors";
import endpoints from "../../utils/constants/endpoints";
import config from "../../config/config";
import userRelationship from "../../utils/constants/userRelationship";
import {models} from "../../database/database";

const {UserRelationShip} = models;
import {profiles, users} from "../../test/seed";


describe('GET /profile/:username', () => {

    beforeEach(async () => {
        await wipeOutDatabase();
        await createUserAndProfile({...users[0]}, {...profiles[0]});
    });

    it('should return a profile by username', (done) => {
        request(app)
            .get(endpoints.user.USERS(users[0].username))
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

    it('should return a profile by userId', (done) => {
        request(app)
            .get(endpoints.user.USERS(users[0].id))
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

    it('should not return a profile with an inexisting username', (done) => {
        request(app)
            .get(endpoints.user.USERS(users[1].username))
            .expect(httpCodes.NOT_FOUND)
            .expect((res) => {
                expect(res.body.error).toBe(error.USER_NOT_FOUND_ERROR);
                expect(res.body.message).toBe(error.USER_NOT_FOUND_ERROR);
            })
            .end(done);
    });

    it('should not return a profile with an inexisting userId', (done) => {
        request(app)
            .get(endpoints.user.USERS(users[1].id))
            .expect(httpCodes.NOT_FOUND)
            .expect((res) => {
                expect(res.body.error).toBe(error.USER_NOT_FOUND_ERROR);
                expect(res.body.message).toBe(error.USER_NOT_FOUND_ERROR);
            })
            .end(done);
    });
});

describe('GET /users/?query=someusername', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        await createUserAndProfile({...users[0]}, {...profiles[0]});
        const {user} = await createUserAndProfile({...users[1]}, {...profiles[1]});
        accessToken = await signJWT(user.id);
    });

    it('should return an array of matches for the search', (done) => {
        request(app)
            .get(endpoints.user.SEARCH + '?query=' + profiles[0].fullname.slice(0, 3))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.body).toBeTruthy();
                res.body.forEach((person: any) => {
                    expect(person.userId).toBeTruthy();
                    expect(person.username).toBeTruthy();
                    expect(person.fullname).toBeTruthy();
                    expect(person.profilePhotoUrl).toBeTruthy();
                });
            })
            .end(done);
    });

    it('should return an empty array of matches for the search', (done) => {
        request(app)
            .get(endpoints.user.SEARCH + '?query=thisisnotasearch')
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.body).toBeInstanceOf(Array);
                expect(res.body.length).toBe(0);
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
        accessToken = await signJWT(user.id);
    });

    it('should send a friend request', (done) => {
        request(app)
            .post(endpoints.user.FRIENDS(users[1].id))
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.CREATED)
            .end(done);
    });

    describe("should get user's friend requests", () => {
        let accessToken;
        beforeEach(async () => {
            const {user} = await createUserAndProfile({...users[2]}, {...profiles[2]});
            accessToken = await signJWT(user.id);
            await UserRelationShip.create({
                senderId: users[0].id,
                receiverId: users[2].id,
                type: userRelationship.PENDING
            });
            await UserRelationShip.create({
                senderId: users[1].id,
                receiverId: users[2].id,
                type: userRelationship.PENDING
            });
        });

        it("should get user's friend requests", (done) => {
            request(app)
                .get(endpoints.user.GET_FRIEND_REQUESTS)
                .set(config.headers.accessToken, accessToken)
                .expect(httpCodes.OK)
                .expect((res) => {
                    //console.log("friend requests =  ", res.body);
                    expect(res.body.length).toBe(2);
                })
                .end(done);
        });
    });
});

describe('POST acceptFriendRequest', () => {
    let accessToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {user} = await createUserAndProfile({...users[0]}, {...profiles[0]});
        await createUserAndProfile({...users[1]}, {...profiles[1]});
        accessToken = await signJWT(user.id);
        await UserRelationShip.create({senderId: users[1].id, receiverId: users[0].id, type: userRelationship.PENDING});
    });

    it('should accept a friend request', (done) => {
        request(app)
            .put(endpoints.user.RESPOND_TO_FRIEND_REQUEST(users[1].id) + "?action=confirm")
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => {
                if (err) return done(err);
                const fRequest = await UserRelationShip.findOne({
                    where: {
                        senderId: users[1].id,
                        receiverId: users[0].id
                    }
                });
                expect(fRequest.type).toBe(userRelationship.FRIEND);
                done();
            });
    });

    it('should reject a friend request', (done) => {
        request(app)
            .put(endpoints.user.RESPOND_TO_FRIEND_REQUEST(users[1].id) + "?action=deny")
            .set(config.headers.accessToken, accessToken)
            .expect(httpCodes.OK)
            .end(async (err, _) => {
                if (err) return done(err);
                const fRequest = await UserRelationShip.findOne({
                    where: {
                        senderId: users[1].id,
                        receiverId: users[0].id
                    }
                });
                expect(fRequest).toBeFalsy();
                done();
            });
    });
});

afterAll((done) => {
    server.close(done);
});