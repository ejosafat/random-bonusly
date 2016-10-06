const availableParams = {
    // '#': {
    //     param: 'hashtag',
    //     usage: '-# why-so-serious',
    //     description: 'hashtag to be used. #why-so-serious by default',
    //     defaults: 'why-so-serious',
    // },
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
    },
    // '_': {
    //     param: 'set',
    //     usage: 'random-bonusly pets food work',
    //     description: 'After the last command line option, if you have not specified a message, add whatever fortune sets you want, separated by spaces, startrek by default',
    //     defaults: ['startrek'],
    // },
};

const paramsBuilder = {
    get(argv) {
        const args = require('minimist')(argv.slice(2), {
            boolean: ['dry-run'],
            //           string: ['#'],
        });
        // console.log(argv.slice(2), args);
        const options = {};

        Object.keys(availableParams).forEach((key) => {
            const param = availableParams[key];

            if (args.hasOwnProperty(key)) {
                options[param.option] = args[key];
            } else {
                options[param.option] = param.defaults;
            }
            //             options[option.param] = args[key] ? args[key] : option.defaults;
        })

        return options;
    },

};

module.exports = paramsBuilder.get;
