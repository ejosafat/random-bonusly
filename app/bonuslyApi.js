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

    getOwnUserName() {
        return new Promise((resolve, reject) => {
            request.get({
                url: `${apiUrl}users/me${auth}`,
                json: true,
            }, (err, resp, body) => {
                if (err || !body.success) {
                    reject(new Error('server failure'));
                } else {
                    resolve(body.result.username);
                }
            });
        });
    },

    getUsers() {
        return new Promise((resolve, reject) => {
            request.get({
                url: `${apiUrl}users${auth}`,
                json: true,
            }, (err, resp, body) => {
                if (err || !body.success) {
                    reject(new Error('server failure'));
                } else {
                    const users = body.result.map(entry => entry.username);
                    resolve(users);
                }
            });
        });
    },

    postBonus(reason) {
        return new Promise((resolve, reject) => {
            request.post({
                url: `${apiUrl}bonuses${auth}`,
                json: {
                    reason,
                },
            }, (err, resp, body) => {
                if (err || !body.success) {
                    reject(new Error(body.message));
                } else {
                    resolve(body.result.giver.giving_balance);
                }
            });
        });
    },
};

module.exports = api;
