const request = require('request');
const accessToken = require('../secrets.json').access_token;
const apiUrl = 'https://bonus.ly/api/v1/';
const auth = `?access_token=${accessToken}`;

const api = {
    getHashtags() {
        return new Promise((resolve, reject) => {
            request.get({
                url: `${apiUrl}/companies/show${auth}`,
                json: true,
            }, (err, resp, body) => {
                if (err || !body.success) {
                    reject(new Error('Server failure'));
                } else {
                    resolve(body.result.company_hashtags);
                }
            });
        });
    },
};

module.exports = api;
