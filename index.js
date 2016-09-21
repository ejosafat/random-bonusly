'use strict';

const https = require('https');
const spawnSync = require('child_process').spawnSync;

const accessToken = require('./secrets.json').access_token;
const apiUrl = 'bonus.ly/api/v1/';
const usersEndpoint = 'users';

const requestUri = `https://${apiUrl}${usersEndpoint}?access_token=${accessToken}`;

let users;

https.get(requestUri, (res) => {
  let output = '';

  res.on('data', (chunk) => {
    output += chunk.toString();
  });

  res.on('end', () => {
    users = JSON.parse(output).result.map(entry => entry.username);
    const user = users[getRandomInt(0, users.length)];
    const fortune = spawnSync('fortune', ['startrek']).stdout.toString();
    let bonus = `+1 @${user} ${fortune} #why-so-serious`;
    console.log(bonus);
  });
}).on('error', (e) => {
  console.log(e);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
