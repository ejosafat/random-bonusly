#!/usr/bin/env node

'use strict';
const request = require('request');
const spawnSync = require('child_process').spawnSync;

const accessToken = require('./secrets.json').access_token;
const apiUrl = 'https://bonus.ly/api/v1/';
const auth = `?access_token=${accessToken}`;
const online = true;

module.exports = {
    reward,
}

if (require.main == module) {
  const argv = require('minimist')(process.argv.slice(2));
  reward({
    'dryRun': argv['dry-run'],
  }).then((result) => {
    console.log(result);
  })
  .catch((err) => console.log('error', err));
}

function reward(options) {
    return new Promise((resolve, reject) => {
        getOthers().then((users) => {
            postBonus({
              reason: createBonus(users),
              dryRun: options.dryRun,
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    });
}

function getOthers() {
    return new Promise((resolve, reject) => {
        Promise.all([getOwnUserName(), getUsers()])
            .then((results) => {
                const [me, users] = results;
                const others = users.filter((username) => username !== me);
                resolve(others);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getOwnUserName() {
    return new Promise((resolve, reject) => {
        request.get({
            url: `${apiUrl}users/me${auth}`,
            json: true,
        }, (err, resp, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body.result.username);
            }
        });
    });
}

function getUsers() {
    return new Promise((resolve, reject) => {
        request.get({
            url: `${apiUrl}users${auth}`,
            json: true,
        }, (err, resp, body) => {
            if (err) {
                reject(err);
            } else {
                const users = body.result.map(entry => entry.username)
                resolve(users);
            }
        });
    });
}

function createBonus(users) {
    const user = users[getRandomInt(0, users.length)];
    const fortune = spawnSync('fortune', ['startrek']).stdout.toString();

    return `+1 @${user} ${fortune} #why-so-serious`
}

function postBonus(options) {
  const { dryRun, reason } = options;
    let left;
    const promise = new Promise((resolve, reject) => {
        if (!dryRun && online) {
            request.post({
                url: `${apiUrl}bonuses${auth}`,
                json: {
                    reason,
                }
            }, (err, resp, body) => {
                if (err) {
                    reject(err);
                } else {
                    left = `${body.result.giver.giving_balance} BK bucks left`;
                    resolve({
                        reason,
                        left,
                    });
                }
            });
        } else {
            resolve({
                reason,
            });
        }
    });
    return promise;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
