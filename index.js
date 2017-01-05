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
    return getUser(options).then(user => {
        try {
            const reason = createBonus(Object.assign(options, {
                user,
            }));
            return postBonus({
                reason,
                dryRun: options.dryRun,
            });
        } catch (e) {
            return Promise.reject(e.message);
        }
    });
}

function addToBonus(options) {
    return Promise.all([api.getBonuses(), api.getOwnUserName()])
        .then(([result, username]) => {
            const promises = [];
            result.filter(excludeGivenBonuses.bind(null, username))
                .forEach(({id, hashtag}) => {
                    const reason = `+${options.points} yay! ${hashtag}`;
                    if (online) promises.push(api.addToBonus(reason, id));
                });
            return Promise.all(promises).then(results => results)
        })
        .catch(err => console.log('err', err));
}

function excludeGivenBonuses(username, bonus) {
    return !bonus.child_bonuses.find(childBonus => childBonus.giver.username === username);
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
    if (!dryRun && online) {
        return api.postBonus(reason).then((pointsLeft) => {
            const left = `${pointsLeft} BK bucks left`;
            return {
                reason,
                left,
            };
        }).catch((err) => {
            return Promise.reject(err);
        });
    } else {
        return Promise.resolve({
            reason,
        });
    }
}

