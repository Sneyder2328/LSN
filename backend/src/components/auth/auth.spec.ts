import request from "supertest";
import {app, server} from "../../index";
import {profiles, users} from "../../test/seed";
import httpCodes from "../../utils/constants/httpResponseCodes";
import {createUserAndProfile, wipeOutDatabase} from "../../test/setup";
import {models} from "../../database/database";
const {Token} = models;
import config from "../../config/config";
import endpoints from "../../utils/constants/endpoints";
import error from "../../utils/constants/errors";
import {Response} from "superagent";

describe('POST /signUp', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
    });

    it('should sign up a new user', (done) => {
        request(app)
            .post(endpoints.auth.SIGN_UP)
            .send({
                ...users[0], ...profiles[0]
            })
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.header[config.headers.accessToken]).toMatch(config.regex.jwt);
                expect(res.header[config.headers.refreshToken]).toMatch(config.regex.uuidV4);
                expect(res.body["access"]).toBe(true);
            })
            .end(done);
    });

    it('should not sign up an user with empty password', (done) => {
        request(app)
            .post(endpoints.auth.SIGN_UP)
            .send({
                ...users[0], ...profiles[0], password: ''
            })
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect((res) => {
                expect(res.header[config.headers.accessToken]).toBeFalsy();
                expect(res.header[config.headers.refreshToken]).toBeFalsy();
            })
            .end(done);
    });

    describe('should not sign up an user', () => {
        beforeEach(async () => {
            await wipeOutDatabase();
            await createUserAndProfile(users[0], profiles[0]);
        });
        it('should not sign up an user with an existing username', (done) => {
            request(app)
                .post(endpoints.auth.SIGN_UP)
                .send({
                    ...users[1], ...profiles[1], username: users[0].username
                })
                .expect(httpCodes.CONFLICT)
                .expect((res) => {
                    expect(res.header[config.headers.accessToken]).toBeFalsy();
                    expect(res.header[config.headers.refreshToken]).toBeFalsy();
                    expect(res.body["message"]).toBe(error.message.USERNAME_TAKEN);
                    expect(res.body["error"]).toBe(error.USERNAME);
                })
                .end(done);
        });

        it('should not sign up an user with an existing email', (done) => {
            request(app)
                .post(endpoints.auth.SIGN_UP)
                .send({
                    ...users[1], ...profiles[1], email: users[0].email
                })
                .expect(httpCodes.CONFLICT)
                .expect((res) => {
                    expect(res.header[config.headers.accessToken]).toBeFalsy();
                    expect(res.header[config.headers.refreshToken]).toBeFalsy();
                    // @ts-ignore
                    expect(res.body.message).toBe(error.message.EMAIL_TAKEN);
                    // @ts-ignore
                    expect(res.body.error).toBe(error.EMAIL);
                })
                .end(done);
        });

    });

});

describe('POST /logIn', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await createUserAndProfile(users[0], profiles[0]);
    });

    it('should login with valid credentials', (done) => {
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({
                username: users[0].username,
                password: users[0].password
            })
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.header[config.headers.accessToken]).toMatch(config.regex.jwt);
                expect(res.header[config.headers.refreshToken]).toMatch(config.regex.uuidV4);
                expect(res.body["access"]).toBe(true);
            })
            .end(done);
    });

    it('should not login with incorrect password', (done) => {
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({
                username: users[0].username,
                password: users[0].password + "xd"
            })
            .expect(httpCodes.UNAUTHORIZED)
            .expect((res) => {
                // @ts-ignore
                expect(res.body.error).toBe(error.PASSWORD);
                // @ts-ignore
                expect(res.body.message).toBe(error.message.INCORRECT_PASSWORD);
            })
            .end(done);
    });

    it('should not login with incorrect username', (done) => {
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({
                username: "notAnExistingUser" + users[0].username,
                password: users[0].password
            })
            .expect(httpCodes.UNAUTHORIZED)
            .expect((res) => {
                // @ts-ignore
                expect(res.body.error).toBe(error.USERNAME);
                // @ts-ignore
                expect(res.body.message).toBe(error.message.INCORRECT_USERNAME);
            })
            .end(done);
    });
});

describe('POST /refreshToken', () => {
    let refreshToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {token} = await createUserAndProfile(users[0], profiles[0], true);
        refreshToken = token.dataValues.token;
    });

    it('should generate a new accessToken for an authenticated user', (done) => {
        request(app)
            .get(endpoints.auth.REFRESH_TOKEN)
            .set(config.headers.refreshToken, refreshToken)
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.header[config.headers.accessToken]).toMatch(config.regex.jwt);
            })
            .end(done);
    });
});

describe('POST /logOut', () => {
    let refreshToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {token} = await createUserAndProfile(users[0], profiles[0], true);
        refreshToken = token.dataValues.token;
    });

    it('should log out and delete token from the db', (done) => {
        request(app)
            .delete(endpoints.auth.LOG_OUT)
            .set(config.headers.refreshToken, refreshToken)
            .expect(httpCodes.OK)
            .expect((res) => {
                // @ts-ignore
                expect(res.body.loggedOut).toBe(true);
            })
            .end(async (err, _) => {
                if (err) return done(err);
                const tokenInDb = await Token.findOne({where: {token: refreshToken}});
                expect(tokenInDb).toBeNull();
                done();
            });
    });

    it('should not log out nor delete token from the db when haveinvalid token', (done) => {
        request(app)
            .delete(endpoints.auth.LOG_OUT)
            .set(config.headers.refreshToken, refreshToken + "hkjhk")
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .end(async (err, _) => {
                if (err) return done(err);
                const tokenInDb = await Token.findOne({where: {token: refreshToken}});
                expect(tokenInDb).toBeDefined();
                done();
            });
    });

});

afterAll((done) => {
    server.close(done);
});