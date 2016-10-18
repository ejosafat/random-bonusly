const availableParams = {
    '#': {
        option: 'hashtag',
        usage: '-# <hashtag>',
        description: 'hashtag to be used. #why-so-serious by default',
        defaults: 'why-so-serious',
        validate(value) {
            return value && value.length > 0;
        }
    },
    'dry-run': {
        option: 'dryRun',
        usage: '--dry-run',
        description: 'generate a bonus and log it without posting',
        defaults: false,
    },
    h: {
        option: 'help',
        usage: '-h',
        description: 'show this help',
        defaults: false,
    },
    m: {
        option: 'message',
        usage: '-m <message>',
        description: 'message to be used. Random quote from fortune by default',
        defaults: '',
    },
    p: {
        option: 'points',
        usage: '-p <number>',
        description: 'number of points to be given. 1 by default.',
        defaults: 1,
        validate(value) {
            const num = parseInt(value, 10);

            return !Number.isNaN(num) && num > 0;
        },
    },
    u: {
        option: 'user',
        usage: '-u <user>',
        description: 'user to give the award to. If not present, It would be selected at random.',
        defaults: '',
    },
    '_': {
        option: 'set',
        usage: 'random-bonusly <set> <set> ...',
        description: 'After the last command line option, if you have not specified a message, add whatever fortune sets you want, separated by spaces, startrek by default',
        defaults: ['startrek'],
        validate(value) {
            return value && value.length > 0;
        }
    },
};

const optionsBuilder = {
    get(argv) {
        const args = require('minimist')(argv.slice(2), {
            boolean: ['dry-run', 'h'],
            string: ['#', 'm', 'u'],
        });

        if (args.h) {
            return {
                help: true,
                helpText: buildHelpText(),
            };
        }
        return Object.keys(availableParams).reduce(addOptions.bind(null, args), {});
    },
};

function buildHelpText() {
    return Object.keys(availableParams).reduce((text, key) => {
        return text += `${availableParams[key].usage}: ${availableParams[key].description}\n`;
    }, '');
}

function addOptions(args, options, key) {
    const param = availableParams[key];

    if (args.hasOwnProperty(key) && isValid(param, args[key])) {
        options[param.option] = args[key];
    } else {
        options[param.option] = param.defaults;
    }

    return options;
}

function isValid(param, value) {
    return param.validate ? param.validate(value) : true;
}

module.exports = optionsBuilder.get;
