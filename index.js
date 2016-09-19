const https = require('https');

const accessToken = require('./secrets.json').access_token;
const apiUrl = 'bonus.ly/api/v1/';
const usersEndpoint = 'users';

const requestUri = `https://${apiUrl}${usersEndpoint}?access_token=${accessToken}`;

https.get(requestUri, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
}).on('error', (e) => {
  console.log(e);
});

