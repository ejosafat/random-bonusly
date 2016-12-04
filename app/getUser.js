const api = require('./bonuslyApi');

function getUser(options) {
    return new Promise((resolve, reject) => {
        if (options.user.length > 0) {
            resolve(options.user);
        } else {
            getOthers().then(users => {
                resolve(users[getRandomInt(0, users.length)]);
            }).catch(err => {
                reject(err);
            });
        }
    });
}

function getOthers() {
    return new Promise((resolve, reject) => {
        Promise.all([api.getOwnUserName(), api.getUsers()])
            .then(results => {
                const [me, users] = results;
                const others = users.filter((username) => username !== me);
                resolve(others);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = getUser;
