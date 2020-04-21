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
const index_1 = require("../../index");
const seed_1 = require("../../test/seed");
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const setup_1 = require("../../test/setup");
const database_1 = require("../../database/database");
const { Token } = database_1.models;
const config_1 = __importDefault(require("../../config/config"));
const endpoints_1 = __importDefault(require("../../utils/constants/endpoints"));
const errors_1 = __importDefault(require("../../utils/constants/errors"));
describe('POST /signUp', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
    }));
    it('should sign up a new user', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.auth.SIGN_UP)
            .send(Object.assign(Object.assign({}, seed_1.users[0]), seed_1.profiles[0]))
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.header[config_1.default.headers.accessToken]).toMatch(config_1.default.regex.jwt);
            expect(res.header[config_1.default.headers.refreshToken]).toMatch(config_1.default.regex.uuidV4);
            expect(res.body["access"]).toBe(true);
        })
            .end(done);
    });
    it('should not sign up an user with empty password', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.auth.SIGN_UP)
            .send(Object.assign(Object.assign(Object.assign({}, seed_1.users[0]), seed_1.profiles[0]), { password: '' }))
            .expect(httpResponseCodes_1.default.UNPROCESSABLE_ENTITY)
            .expect((res) => {
            expect(res.header[config_1.default.headers.accessToken]).toBeFalsy();
            expect(res.header[config_1.default.headers.refreshToken]).toBeFalsy();
        })
            .end(done);
    });
    describe('should not sign up an user', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.wipeOutDatabase();
            yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
        }));
        it('should not sign up an user with an existing username', (done) => {
            supertest_1.default(index_1.app)
                .post(endpoints_1.default.auth.SIGN_UP)
                .send(Object.assign(Object.assign(Object.assign({}, seed_1.users[1]), seed_1.profiles[1]), { username: seed_1.users[0].username }))
                .expect(httpResponseCodes_1.default.CONFLICT)
                .expect((res) => {
                expect(res.header[config_1.default.headers.accessToken]).toBeFalsy();
                expect(res.header[config_1.default.headers.refreshToken]).toBeFalsy();
                expect(res.body["message"]).toBe(errors_1.default.message.USERNAME_TAKEN);
                expect(res.body["error"]).toBe(errors_1.default.USERNAME);
            })
                .end(done);
        });
        it('should not sign up an user with an existing email', (done) => {
            supertest_1.default(index_1.app)
                .post(endpoints_1.default.auth.SIGN_UP)
                .send(Object.assign(Object.assign(Object.assign({}, seed_1.users[1]), seed_1.profiles[1]), { email: seed_1.users[0].email }))
                .expect(httpResponseCodes_1.default.CONFLICT)
                .expect((res) => {
                expect(res.header[config_1.default.headers.accessToken]).toBeFalsy();
                expect(res.header[config_1.default.headers.refreshToken]).toBeFalsy();
                // @ts-ignore
                expect(res.body.message).toBe(errors_1.default.message.EMAIL_TAKEN);
                // @ts-ignore
                expect(res.body.error).toBe(errors_1.default.EMAIL);
            })
                .end(done);
        });
    });
});
describe('POST /logIn', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0]);
    }));
    it('should login with valid credentials', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.auth.LOG_IN)
            .send({
            username: seed_1.users[0].username,
            password: seed_1.users[0].password
        })
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.header[config_1.default.headers.accessToken]).toMatch(config_1.default.regex.jwt);
            expect(res.header[config_1.default.headers.refreshToken]).toMatch(config_1.default.regex.uuidV4);
            expect(res.body["access"]).toBe(true);
        })
            .end(done);
    });
    it('should not login with incorrect password', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.auth.LOG_IN)
            .send({
            username: seed_1.users[0].username,
            password: seed_1.users[0].password + "xd"
        })
            .expect(httpResponseCodes_1.default.UNAUTHORIZED)
            .expect((res) => {
            // @ts-ignore
            expect(res.body.error).toBe(errors_1.default.PASSWORD);
            // @ts-ignore
            expect(res.body.message).toBe(errors_1.default.message.INCORRECT_PASSWORD);
        })
            .end(done);
    });
    it('should not login with incorrect username', (done) => {
        supertest_1.default(index_1.app)
            .post(endpoints_1.default.auth.LOG_IN)
            .send({
            username: "notAnExistingUser" + seed_1.users[0].username,
            password: seed_1.users[0].password
        })
            .expect(httpResponseCodes_1.default.UNAUTHORIZED)
            .expect((res) => {
            // @ts-ignore
            expect(res.body.error).toBe(errors_1.default.USERNAME);
            // @ts-ignore
            expect(res.body.message).toBe(errors_1.default.message.INCORRECT_USERNAME);
        })
            .end(done);
    });
});
describe('POST /refreshToken', () => {
    let refreshToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { token } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0], true);
        refreshToken = token.dataValues.token;
    }));
    it('should generate a new accessToken for an authenticated user', (done) => {
        supertest_1.default(index_1.app)
            .get(endpoints_1.default.auth.REFRESH_TOKEN)
            .set(config_1.default.headers.refreshToken, refreshToken)
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            expect(res.header[config_1.default.headers.accessToken]).toMatch(config_1.default.regex.jwt);
        })
            .end(done);
    });
});
describe('POST /logOut', () => {
    let refreshToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup_1.wipeOutDatabase();
        const { token } = yield setup_1.createUserAndProfile(seed_1.users[0], seed_1.profiles[0], true);
        refreshToken = token.dataValues.token;
    }));
    it('should log out and delete token from the db', (done) => {
        supertest_1.default(index_1.app)
            .delete(endpoints_1.default.auth.LOG_OUT)
            .set(config_1.default.headers.refreshToken, refreshToken)
            .expect(httpResponseCodes_1.default.OK)
            .expect((res) => {
            // @ts-ignore
            expect(res.body.loggedOut).toBe(true);
        })
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return done(err);
            const tokenInDb = yield Token.findOne({ where: { token: refreshToken } });
            expect(tokenInDb).toBeNull();
            done();
        }));
    });
    it('should not log out nor delete token from the db when haveinvalid token', (done) => {
        supertest_1.default(index_1.app)
            .delete(endpoints_1.default.auth.LOG_OUT)
            .set(config_1.default.headers.refreshToken, refreshToken + "hkjhk")
            .expect(httpResponseCodes_1.default.UNPROCESSABLE_ENTITY)
            .end((err, _) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return done(err);
            const tokenInDb = yield Token.findOne({ where: { token: refreshToken } });
            expect(tokenInDb).toBeDefined();
            done();
        }));
    });
});
afterAll((done) => {
    index_1.server.close(done);
});
