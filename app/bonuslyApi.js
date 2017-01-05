const request = require('request');
const accessToken = require('../secrets.json').access_token;
const apiUrl = 'https://bonus.ly/api/v1/';
const auth = `?access_token=${accessToken}`;
const moment = require('moment');

const api = {
    getHashtags() {
        return get(`${apiUrl}/companies/show${auth}`).then(result => {
            return result.company_hashtags;
        }).catch(err => Promise.reject(err));
    },

    getOwnUserName() {
        return get(`${apiUrl}users/me${auth}`).then(result => {
            return result.username;
        }).catch(err => Promise.reject(err));
    },

    getUsers() {
        return get(`${apiUrl}users${auth}`).then(result => {
            const users = result.map(entry => entry.username);
            return users;
        }).catch(err => Promise.reject(err));
    },

    postBonus(reason) {
        return post(`${apiUrl}bonuses${auth}`, { reason });
    },

    addToBonus(reason, bonusId) {
        return post(`${apiUrl}bonuses${auth}`, {
            reason,
            parent_bonus_id: bonusId,
        });
    },

    getBonuses() {
        return get(`${apiUrl}bonuses${auth}&start_time=${startTime()}&include_children=true`)
    },
};

function startTime() {
    return moment().subtract(1, 'day').format('YYYYMMDD');
}

function post(url, json) {
    return new Promise((resolve, reject) => {
        request.post({
            url,
            json,
        }, (err, resp, body) => {
            if (err || !body.success) {
                reject(new Error(body.message));
            } else {
                resolve(body.result.giver.giving_balance);
            }
        });
    });
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
