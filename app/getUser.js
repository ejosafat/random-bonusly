const api = require('./bonuslyApi');

function getUser(options) {
    if (options.user.length > 0) {
        return Promise.resolve(options.user);
    } else {
        return getOthers().then(users => {
            return users[getRandomInt(0, users.length)];
        }).catch(err => {
            return Promise.reject(err);
        });
    }
}

function getOthers() {
    return Promise.all([api.getOwnUserName(), api.getUsers()])
        .then(results => {
            const [me, users] = results;
            const others = users.filter((username) => username !== me);
            return others;
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

function getWeightedDistributionOfUsers(users) {
    const min = users.reduce((minEarnings, user) => {
        if (minEarnings > user.lifetime_earnings) {
            return user.lifetime_earnings;
        }
        return minEarnings;
    };

    const wUsers = users.map(user => {
        const ratio = ratio / user.lifetime_earnings;
        return new Array(parseInt(ratio * 10, 10)).fill(user.username);
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = getUser;
