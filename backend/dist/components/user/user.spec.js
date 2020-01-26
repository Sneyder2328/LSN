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
const JWTHelper_1 = require("../../helpers/JWTHelper");
const index_1 = require("../../index");
const setup_1 = require("../../test/setup");
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const errors_1 = __importDefault(require("../../utils/constants/errors"));
const endpoints_1 = __importDefault(require("../../utils/constants/endpoints"));
const config_1 = __importDefault(require("../../config/config"));
const userRelationship_1 = __importDefault(require("../../utils/constants/userRelationship"));
const database_1 = require("../../database/database");
const { UserRelationShip } = database_1.models;
const seed_1 = require("../../test/seed");
describe('GET /profile/:username', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        yield setup_1.createUserAndProfile(Object.assign({}, seed_1.users[0]), Object.assign({}, seed_1.profiles[0]));
    }));
    it('should return a profile', (done) => {
        supertest_1.default(index_1.app)
            .get(endpoints_1.default.user.GET_PROFILE(seed_1.users[0].username))
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.body.username).toBe(seed_1.users[0].username);
            expect(res.body.fullname).toBe(seed_1.profiles[0].fullname);
            expect(res.body.description).toBe(seed_1.profiles[0].description);
            expect(res.body.coverPhotoUrl).toBe(seed_1.profiles[0].coverPhotoUrl);
            expect(res.body.profilePhotoUrl).toBe(seed_1.profiles[0].profilePhotoUrl);
        })
            .end(done);
    });
    it('should not return a profile', (done) => {
        supertest_1.default(index_1.app)
            .get(endpoints_1.default.user.GET_PROFILE(seed_1.users[1].username))
            .expect(httpResponseCodes_1.default.NOT_FOUND)
            .expect((res) => {
            expect(res.body.error).toBe(errors_1.default.USER_NOT_FOUND_ERROR);
            expect(res.body.message).toBe(errors_1.default.USER_NOT_FOUND_ERROR);
        })
            .end(done);
    });
});
describe('GET /users/?query=someusername', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        yield setup_1.createUserAndProfile(Object.assign({}, seed_1.users[0]), Object.assign({}, seed_1.profiles[0]));
        yield setup_1.createUserAndProfile(Object.assign({}, seed_1.users[1]), Object.assign({}, seed_1.profiles[1]));
    }));
    it('should return an array of matches for the search', (done) => {
        supertest_1.default(index_1.app)
            .get(endpoints_1.default.user.SEARCH + '?query=' + seed_1.profiles[0].fullname.slice(0, 3))
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.body).toBeTruthy();
            res.body.forEach((person) => {
                expect(person.userId).toBeTruthy();
                expect(person.username).toBeTruthy();
                expect(person.fullname).toBeTruthy();
                expect(person.profilePhotoUrl).toBeTruthy();
            });
        })
            .end(done);
    });
    it('should return an empty array of matches for the search', (done) => {
        supertest_1.default(index_1.app)
            .get(endpoints_1.default.user.SEARCH + '?query=thisisnotasearch')
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(0);
        })
            .end(done);
    });
});
describe('POST /sendFriendRequest', () => {
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(Object.assign({}, seed_1.users[0]), Object.assign({}, seed_1.profiles[0]));
        yield setup_1.createUserAndProfile(Object.assign({}, seed_1.users[1]), Object.assign({}, seed_1.profiles[1]));
        accessToken = yield JWTHelper_1.signJWT(user.id);
    }));
    it('should send a friend request', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.user.SEND_FRIEND_REQUEST(seed_1.users[1].id))
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.CREATED)
            .end(done);
    });
    describe("should get user's friend requests", () => {
        let accessToken;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const { user } = yield setup_1.createUserAndProfile(Object.assign({}, seed_1.users[2]), Object.assign({}, seed_1.profiles[2]));
            accessToken = yield JWTHelper_1.signJWT(user.id);
            yield UserRelationShip.create({
                senderId: seed_1.users[0].id,
                receiverId: seed_1.users[2].id,
                type: userRelationship_1.default.PENDING
            });
            yield UserRelationShip.create({
                senderId: seed_1.users[1].id,
                receiverId: seed_1.users[2].id,
                type: userRelationship_1.default.PENDING
            });
        }));
        it("should get user's friend requests", (done) => {
            supertest_1.default(index_1.app)
                .get(endpoints_1.default.user.GET_FRIEND_REQUESTS)
                .set(config_1.default.headers.accessToken, accessToken)
                .expect(httpResponseCodes_1.default.OK)
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
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { user } = yield setup_1.createUserAndProfile(Object.assign({}, seed_1.users[0]), Object.assign({}, seed_1.profiles[0]));
        yield setup_1.createUserAndProfile(Object.assign({}, seed_1.users[1]), Object.assign({}, seed_1.profiles[1]));
        accessToken = yield JWTHelper_1.signJWT(user.id);
        yield UserRelationShip.create({ senderId: seed_1.users[1].id, receiverId: seed_1.users[0].id, type: userRelationship_1.default.PENDING });
    }));
    it('should accept a friend request', (done) => {
        supertest_1.default(index_1.app)
            .put(endpoints_1.default.user.RESPOND_TO_FRIEND_REQUEST(seed_1.users[1].id) + "?action=confirm")
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return done(err);
            const fRequest = yield UserRelationShip.findOne({
                where: {
                    senderId: seed_1.users[1].id,
                    receiverId: seed_1.users[0].id
                }
            });
            expect(fRequest.type).toBe(userRelationship_1.default.FRIEND);
            done();
        }));
    });
    it('should reject a friend request', (done) => {
        supertest_1.default(index_1.app)
            .put(endpoints_1.default.user.RESPOND_TO_FRIEND_REQUEST(seed_1.users[1].id) + "?action=deny")
            .set(config_1.default.headers.accessToken, accessToken)
            .expect(httpResponseCodes_1.default.OK)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return done(err);
            const fRequest = yield UserRelationShip.findOne({
                where: {
                    senderId: seed_1.users[1].id,
                    receiverId: seed_1.users[0].id
                }
            });
            expect(fRequest).toBeFalsy();
            done();
        }));
    });
});
afterAll((done) => {
    index_1.server.close(done);
});
