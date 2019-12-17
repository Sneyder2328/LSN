const request = require('supertest');

const {app, server} = require('../src/app');
const httpCodes = require('../src/utils/constants/httpResponseCodes');
const error = require('../src/utils/constants/errors');
const endpoints = require('../src/utils/constants/endpoints');
const {wipeOutDatabase} = require('./index');
const {User, Profile} = require('../src/database/database');
const {users, profiles} = require('./seed');

describe('GET /profile/:username', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await User.create({...users[0]});
        await Profile.create({...profiles[0]});
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
            .expect((res)=>{
                expect(res.body.error).toBe(error.USER_NOT_FOUND_ERROR);
                expect(res.body.message).toBe(error.USER_NOT_FOUND_ERROR);
            })
            .end(done);
    });
});

afterAll((done) => {
    server.close(done);
});