#!/usr/bin/env node

'use strict';
const request = require('request');
const spawnSync = require('child_process').spawnSync;

const accessToken = require('./secrets.json').access_token;
const apiUrl = 'https://bonus.ly/api/v1/';
const auth = `?access_token=${accessToken}`;

getOthers().then((users) => {
    postBonus(createBonus(users));
});

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

function postBonus(reason) {
    console.log(reason);
    request.post({
        url: `${apiUrl}bonuses${auth}`,
        json: {
          reason,
        }
      }, (err, resp, body) => {
        if (resp.statusCode === 200) {
          console.log(`${body.result.giver.giving_balance} BK bucks left`);
        } else {
          console.log(err);
        }
      });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
