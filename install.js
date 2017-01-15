const ask = require('prompt');
const fs = require('fs');

const schema = {
    properties: {
        key: {
            description: 'Bonusly API key (you can find it in https://bonus.ly/api)',
            required: true,
        },
    },
};

ask.message = null;

console.log('Generating secrets.json'); // eslint-disable-line
ask.get(schema, (err, result) => {
    const json = JSON.stringify({
        access_token: result.key,
    });

    fs.writeFileSync('secrets.json', json, 'utf8');
    console.log('File generated'); // eslint-disable-line
});
