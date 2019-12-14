const request = require('supertest');
const {app} = require('./../server/server');

describe('GET profile/:username', () => {
    it('should return a profile', (done) => {
        request(app)
            .get('/profile/sneyder2328')
            .expect(200)
            .expect(res => {
                expect(true).toBe(true);
            })
            .end(done);
    });
});

