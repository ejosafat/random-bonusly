const assert = require('assert');
const mockery = require('mockery');

describe('getUser', () => {
    it('returns the user given as option if present', (done) => {
        const apiMock = {};
        mockery.enable();
        mockery.registerMock('./bonuslyApi', apiMock);
        const getUser = require('../app/getUser');
        const options = {
            user: 'pepe.monagas',
        };
        getUser(options).then(user => {
            assert.strictEqual(user, 'pepe.monagas');
            done();
        });
        mockery.disable();
    });
});
