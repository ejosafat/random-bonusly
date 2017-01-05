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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = getUser;
