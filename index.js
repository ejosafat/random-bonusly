#!/usr/bin/env node

'use strict';
const spawnSync = require('child_process').spawnSync;

const optionsBuilder = require('./app/optionsBuilder');
const api = require('./app/bonuslyApi');
const getUser = require('./app/getUser');

const online = true;

module.exports = {
    reward,
};

if (require.main == module) {
    const options = optionsBuilder(process.argv);
    if (options.help) {
        require('./app/help')(options.helpText).then(text => {
            console.log(text); // eslint-disable-line
        });
    } else {
        reward(options).then((result) => {
            console.log(result); // eslint-disable-line
        }).catch((err) => console.log(err)); // eslint-disable-line
    }
}

function reward(options) {
    if (options.add) {
        return addToBonus(options);
    }
    return new Promise((resolve, reject) => {
        getUser(options).then(user => {
            try {
                const reason = createBonus(Object.assign(options, {
                    user,
                }));
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

function addToBonus(options) {
    return new Promise((resolve, reject) => {
        Promise.all([api.getBonuses(), api.getOwnUserName()])
            .then(([result, username]) => {
                const promises = [];
                result.filter(bonus => {
                    return !bonus.child_bonuses.find(childBonus => childBonus.giver.username === username);
                })
                .map(({id, hashtag, receiver}) => ({
                    id,
                    hashtag,
                    user: receiver.username
                })).forEach(({id, hashtag, user}) => {
                   const reason = `+${options.points} yay! ${hashtag}`;
                   if (online) promises.push(api.addToBonus(reason, id));
                });
                Promise.all(promises).then((results) => {
                    resolve(results);
                }).catch(err => console.log(err));
            })
            .catch(err => console.log('err', err));
    });
}

function createBonus(options) {
    const { user, hashtag, set, points, message } = options;
    const msg = message.length > 0 ? message : getRandomMessage(set);
    return `+${points} @${user} ${msg} #${hashtag}`;
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

