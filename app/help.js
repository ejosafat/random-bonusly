const api = require('./bonuslyApi');
const spawnSync = require('child_process').spawnSync;

function getHelpText(paramsHelpText) {
    return Promise.all([api.getHashtags(), api.getUsers()]).then((result) => {
        return makeHelpText(paramsHelpText, ...result);
    });
}

function makeHelpText(helpText, hashtags, users) {
    const text = `
${helpText}
Available hashtags:
${hashtags.join(', ')}

Available sets:
${getFortuneSets()}

Available users:
${users.join(', ')}
    `;
    return text;
}

function getFortuneSets() {
    const cmdOutput = spawnSync('fortune', ['-f']).stderr.toString().split('\n');
    const setRegexp = /[a-z-]+/;
    cmdOutput.pop();
    return cmdOutput.map(set => {
        return setRegexp.exec(set).shift();
    }).slice(1).join(', ');

}

module.exports = getHelpText;

