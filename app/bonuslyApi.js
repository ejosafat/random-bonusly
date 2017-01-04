const request = require('request');
const accessToken = require('../secrets.json').access_token;
const apiUrl = 'https://bonus.ly/api/v1/';
const auth = `?access_token=${accessToken}`;
const moment = require('moment');

const api = {
    getHashtags() {
        return new Promise((resolve, reject) => {
            get(`${apiUrl}/companies/show${auth}`).then(result => {
                resolve(result.company_hashtags);
            }).catch(err => {
                reject(err);
            });
        });
    },

    getOwnUserName() {
        return new Promise((resolve, reject) => {
            get(`${apiUrl}users/me${auth}`).then(result => {
                resolve(result.username);
            }).catch(err => {
                reject(err);
            });
        });
    },

    getUsers() {
        return new Promise((resolve, reject) => {
            get(`${apiUrl}users${auth}`).then(result => {
                const users = result.map(entry => entry.username);
                resolve(users);
            }).catch(err => {
                reject(err);
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

    addToBonus(reason, bonusId) {
        return new Promise((resolve, reject) => {
            request.post({
                url: `${apiUrl}bonuses${auth}`,
                json: {
                    reason,
                    parent_bonus_id: bonusId,
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

    getBonuses() {
        return new Promise((resolve, reject) => {
            get(`${apiUrl}bonuses${auth}&start_time=${startTime()}&include_children=true`)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
};

function startTime() {
    return moment().subtract(1, 'day').format('YYYYMMDD');
}

function get(url) {
    return new Promise((resolve, reject) => {
        request.get({
            url,
            json: true,
        }, (err, resp, body) => {
            if (err || !body.success) {
                reject(body.message || new Error('Server failure'));
            } else {
                resolve(body.result);
            }
        });
    });
}

module.exports = api;
