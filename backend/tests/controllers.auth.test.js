const request = require('supertest');

const {app, server} = require('../src/app');
const {users, profiles} = require('./seed');

const httpCodes = require('../src/utils/constants/httpResponseCodes');
const {wipeOutDatabase, createUserAndProfile} = require('./index');
const {config} = require('../src/config/config');
const error = require('../src/utils/constants/errors');
const endpoints = require('../src/utils/constants/endpoints');

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
                expect(res.headers[config.headers.accessToken]).toMatch(config.regex.jwt);
                expect(res.headers[config.headers.refreshToken]).toMatch(config.regex.uuidV4);
                expect(res.body.access).toBe(true);
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
                expect(res.headers[config.headers.accessToken]).toBeFalsy();
                expect(res.headers[config.headers.refreshToken]).toBeFalsy();
            })
            .end(done);
    });

    describe('should not sign up an user', () => {
        beforeEach(async () => {
            await wipeOutDatabase();
            await createUserAndProfile({...users[0]}, {...profiles[0]});
        });
        it('should not sign up an user with an existing username', (done) => {
            request(app)
                .post(endpoints.auth.SIGN_UP)
                .send({
                    ...users[1], ...profiles[1], username: users[0].username
                })
                .expect(httpCodes.CONFLICT)
                .expect((res) => {
                    expect(res.headers[config.headers.accessToken]).toBeFalsy();
                    expect(res.headers[config.headers.refreshToken]).toBeFalsy();
                    expect(res.body.message).toBe(error.message.USERNAME_TAKEN);
                    expect(res.body.error).toBe(error.CONFLICT_ERROR);
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
                    expect(res.headers[config.headers.accessToken]).toBeFalsy();
                    expect(res.headers[config.headers.refreshToken]).toBeFalsy();
                    expect(res.body.message).toBe(error.message.EMAIL_TAKEN);
                    expect(res.body.error).toBe(error.CONFLICT_ERROR);
                })
                .end(done);
        });

    });

});

describe('POST /logIn', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await createUserAndProfile({...users[0]}, {...profiles[0]});
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
                expect(res.headers[config.headers.accessToken]).toMatch(config.regex.jwt);
                expect(res.headers[config.headers.refreshToken]).toMatch(config.regex.uuidV4);
                expect(res.body.access).toBe(true);
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
                expect(res.body.error).toBe(error.AUTH_ERROR);
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
                expect(res.body.error).toBe(error.AUTH_ERROR);
                expect(res.body.message).toBe(error.message.INCORRECT_USERNAME);
            })
            .end(done);
    });
});


describe('POST /refreshToken', () => {
    let refreshToken;
    beforeEach(async () => {
        await wipeOutDatabase();
        const {token} = await createUserAndProfile({...users[0]}, {...profiles[0]}, true);
        refreshToken = token.dataValues.token;
    });

    it('should generate a new accessToken for an authenticated user', (done) => {
        request(app)
            .get(endpoints.auth.REFRESH_TOKEN)
            .set(config.headers.refreshToken, refreshToken)
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.headers[config.headers.accessToken]).toMatch(config.regex.jwt);
            })
            .end(done);
    });
});


afterAll((done) => {
    server.close(done);
});