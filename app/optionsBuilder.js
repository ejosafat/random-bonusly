const availableParams = {
    '#': {
        option: 'hashtag',
        usage: '-# why-so-serious',
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
    // h: {
    //     params: 'help',
    //     usage: '-h',
    //     description: 'show this help',
    //     defaults: false,
    // },
    // m: {
    //     param: 'message',
    //     usage: '-m "You are legend"',
    //     description: 'message to be used. Random quote from fortune by default',
    //     defaults: false,
    // },
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
    // '_': {
    //     param: 'set',
    //     usage: 'random-bonusly pets food work',
    //     description: 'After the last command line option, if you have not specified a message, add whatever fortune sets you want, separated by spaces, startrek by default',
    //     defaults: ['startrek'],
    // },
};

const optionsBuilder = {
    get(argv) {
        const args = require('minimist')(argv.slice(2), {
            boolean: ['dry-run'],
            string: ['#'],
        });

        return Object.keys(availableParams).reduce(addOptions.bind(null, args), {});
    },
};

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
