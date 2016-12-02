const mockery = require('mockery');
const assert = require('assert');
const companyResponse = require('./companyResponse.json');
const meResponse = require('./meResponse.json');
const usersResponse = require('./usersResponse.json');

const requestMock = {
    get(options, callback) {
        let result;

        if (/companies/.test(options.url)) {
            result = companyResponse;
        } else if (/users\/me/.test(options.url)) {
            result = meResponse;
        } else {
            result = usersResponse;
        }

        callback(null, null, {
            success: true,
            result,
        });
    }
};

describe('bonuslyApi', () => {
    let api;

    before(() => {
        mockery.enable();
        mockery.registerAllowables(['../app/bonuslyApi', '../secrets.json']);
        mockery.registerMock('request', requestMock);
        api = require('../app/bonuslyApi');
    });

    after(() => {
        mockery.deregisterMock('request');
        mockery.disable();
    });

    describe('getHashtags', () => {
        it('returns the company hashtags', (done) => {
            api.getHashtags().then(result => {
                assert.deepStrictEqual(result, companyResponse.company_hashtags);
                done();
            })
        });
    });

    describe('getOwnUserName', () => {
        it('returns the user name', (done) => {
            api.getOwnUserName().then(result => {
                assert.strictEqual(result, meResponse.username);
                done();
            });
        });
    });

    describe('getUsers', () => {
        it('returns an arry of users', (done) => {
            api.getUsers().then(result => {
                assert.deepStrictEqual(result, usersResponse.map(user => user.username));
                done();
            });
        });
    });
});
