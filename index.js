#!/usr/bin/env node

'use strict';
const spawnSync = require('child_process').spawnSync;

const optionsBuilder = require('./app/optionsBuilder');
const api = require('./app/bonuslyApi');

const online = true;

module.exports = {
    reward,
};

if (require.main == module) {
    reward(optionsBuilder(process.argv)).then((result) => {
        console.log(result); // eslint-disable-line
    }).catch((err) => console.log(err)); // eslint-disable-line
}

function reward(options) {
    return new Promise((resolve, reject) => {
        if (options.help) {
            Promise.all([api.getHashtags(), api.getUsers()]).then((result) => {
                resolve(makeHelpText(options.helpText, ...result));
            }).catch((err) => {
                reject(err);
            });
            return;
        }
        getOthers().then((users) => {
            try {
                const reason = createBonus(Object.assign({
                    users,
                }, options));
                postBonus({
                    reason,
                    dryRun: options.dryRun,
                }).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            } catch (e) {
                reject(e.message);
                return;
            }
        })
        .catch((err) => {
            reject(err);
        });
    });
}

function getOthers() {
    return new Promise((resolve, reject) => {
        Promise.all([api.getOwnUserName(), api.getUsers()])
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

function createBonus(options) {
    const { user, hashtag, set, users, points, message } = options;
    const receiver = user.length > 0 ? user : users[getRandomInt(0, users.length)];
    const msg = message.length > 0 ? message : getRandomMessage(set);
    return `+${points} @${receiver} ${msg} #${hashtag}`;
}

function getRandomMessage(set) {
    const cmdOutput = spawnSync('fortune', set);
    if (cmdOutput.status === 1) {
        throw new Error('invalid fortune set');
    } else if (cmdOutput.status === null) {
        throw new Error('Can\'t generate a random message as fortune is not present in your system');
    }
    return cmdOutput.stdout.toString();
}

function postBonus(options) {
    const { dryRun, reason } = options;
    const promise = new Promise((resolve, reject) => {
        if (!dryRun && online) {
            api.postBonus(reason).then((pointsLeft) => {
                const left = `${pointsLeft} BK bucks left`;
                resolve({
                    reason,
                    left,
                });
            }).catch((err) => {
                reject(err);
            });
        } else {
            resolve({
                reason,
            });
        }
    });
    return promise;
}

function makeHelpText(helpText, hashtags, users) {
    const text = `
${helpText}
Available hashtags:
${hashtags.join(', ')}
Available users:
${users.join(', ')}
    `;
    return text;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
