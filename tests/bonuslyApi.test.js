const mockery = require('mockery');
const assert = require('assert');
const companyResponse = require('./companyResponse.json');
const requestMock = {
    get(options, callback) {
        callback(null, null, {
            statusCode: 200,
            result: companyResponse,
        });
    }
};

describe('bonuslyApi', () => {
    before(() => {
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('request', requestMock);
        mockery.registerMock('./_stream_duplex', {});
    });

    after(() => {
        mockery.deregisterMock('request');
        mockery.disable();
    });

    describe('getHashtags', () => {
        it('returns the company hashtags', (done) => {
            const api = require('../app/bonuslyApi');
            api.getHashtags().then((result) => {
                assert.deepStrictEqual(result, companyResponse.company_hashtags);
                done();
            })
        });
    });
});
