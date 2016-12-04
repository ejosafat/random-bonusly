const api = require('./bonuslyApi');

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

Available users:
${users.join(', ')}
    `;
    return text;
}

module.exports = getHelpText;

