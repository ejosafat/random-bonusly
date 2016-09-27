#!/usr/bin/env node

'use strict';
const request = require('request');
const spawnSync = require('child_process').spawnSync;

const accessToken = require('./secrets.json').access_token;
const apiUrl = 'https://bonus.ly/api/v1/';
const auth = `?access_token=${accessToken}`;
const online = false;

module.exports = {
    reward,
}

if (require.main == module) {
  const argv = require('minimist')(process.argv.slice(2), {
    boolean: true,
  });
  reward({
    dryRun: argv['dry-run'],
    set: argv._,
    points: argv.p || 1,
    hashtag: argv['#'] || 'why-so-serious',
  }).then((result) => {
    console.log(result);
  })
  .catch((err) => console.log('error', err));
}

function reward(options) {
    return new Promise((resolve, reject) => {
        getOthers().then((users) => {
          const reason = createBonus(Object.assign({
            users,
          }, options))

          postBonus({
              reason,
              dryRun: options.dryRun,
            }).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        })
        .catch((err) => {
          console.log(err);
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

function createBonus(options) {
    const { hashtag, set, users, points } = options;
    const user = users[getRandomInt(0, users.length)];
    const fortuneSet = set.length === 0 ? ['startrek'] : set;
    const fortune = spawnSync('fortune', fortuneSet).stdout.toString();

    return `+${points} @${user} ${fortune} #${hashtag}`
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
