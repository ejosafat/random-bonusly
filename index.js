#!/usr/bin/env node

'use strict';

const https = require('https');
const request = require('request');

const spawnSync = require('child_process').spawnSync;

const accessToken = require('./secrets.json').access_token;
const apiUrl = 'bonus.ly/api/v1/';
const usersEndpoint = 'users';

const requestUri = `https://${apiUrl}${usersEndpoint}?access_token=${accessToken}`;

let users;
let me;

request.get({
    url: `https://bonus.ly/api/v1/users/me?access_token=${accessToken}`,
    json: true,
}, (err, resp, body) => {
    me = body.result.username;
    requestUsers();
});

function requestUsers() {
    request.get({
        url: requestUri,
        json: true,
    }, (err, resp, body) => {
        users = body.result.map(entry => entry.username)
            .filter((username) => username !== me);
        const bonus = createBonus(users);
        postBonus(bonus);
    });
}

function createBonus(users) {
    const user = users[getRandomInt(0, users.length)];
    const fortune = spawnSync('fortune', ['startrek']).stdout.toString();
    let bonus = `+1 @${user} ${fortune} #why-so-serious`;
    console.log(bonus);
    return bonus;
}

function postBonus(bonus) {
    request.post({
        url: `https://bonus.ly/api/v1/bonuses?access_token=${accessToken}`,
        json: {
          reason: bonus,
        }
      }, (err, resp, body) => {
        if (resp.statusCode === 200) {
          console.log(`Remaining: ${body.result.giver.giving_balance} BK bucks`);
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
