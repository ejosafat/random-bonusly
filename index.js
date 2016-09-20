'use strict';

const https = require('https');

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
    console.log(users);
  });
}).on('error', (e) => {
  console.log(e);
});

