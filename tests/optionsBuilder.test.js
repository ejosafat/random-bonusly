const assert = require('assert');
const optionsBuilder = require('../app/optionsBuilder.js');

const commandArgv = [
    '/usr/local/Cellar/node/6.6.0/bin/node',
    '/usr/local/bin/random-bonusly',
];

describe('optionsBuilder', () => {
    describe('dryRun', () => {
        it('is true if --dry-run is present', () => {
            const argv = commandArgv.concat('--dry-run');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.dryRun, true);
        });

        it('is false if --dry-run is not present', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.strictEqual(options.dryRun, false);
        });
    });

    describe('help', () => {
        it('is true if -h is present', () => {
            const argv = commandArgv.concat('-h');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.help, true);
        });

        it('is false if -h is not present', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.strictEqual(options.help, false);
        });
    });

    describe('add', () => {
        it('is true if -a is present', () => {
            const argv = commandArgv.concat('-a');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.add, true);
        });

        it('is false if -a is not present', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.strictEqual(options.add, false);
        });
    });

    describe('points', () => {
        it('is <number> if -p<number> is present', () => {
            const argv = commandArgv.concat('-p3');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.points, 3);
        });

        it('is <number> if -p <number> is present', () => {
            const argv = commandArgv.concat(['-p', '3']);

            const options = optionsBuilder(argv);
            assert.strictEqual(options.points, 3);
        });

        it('is 1 if -p <number> is present and <number> is not a number', () => {
            const argv = commandArgv.concat(['-p', 'hi']);

            const options = optionsBuilder(argv);
            assert.strictEqual(options.points, 1);
        });

        it('is 1 if -p<number> is present and <number> is not a number', () => {
            const argv = commandArgv.concat('-pbye');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.points, 1);
        });

        it('is 1 if -p is present in the command line', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.strictEqual(options.points, 1);
        });
    });

    describe('hashtag', () => {
        it('is <string> if -# <string> is present', () => {
            const argv = commandArgv.concat('-#', 'hola-que-tal');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.hashtag, 'hola-que-tal');
        });

        it('is why-so-serious if -#<string> is present', () => {
            const argv = commandArgv.concat('-#see-you-later');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.hashtag, 'why-so-serious');
        });

        it('is why-so-serious if -# is not present', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.strictEqual(options.hashtag, 'why-so-serious');
        });
    });

    describe('message', () => {
        it('is <string> if -m <string> is present', () => {
            const argv = commandArgv.concat('-m', 'bye');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.message, 'bye');
        });

        it('is an empty string if -m<string> is present', () => {
            const argv = commandArgv.concat('-mbye');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.message, '');
        });

        it('is an empty string if -m is not present', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.strictEqual(options.message, '');
        });
    });

    describe('set', () => {
        it('is a list of strings if there one or more after all the params', () => {
            const argv = commandArgv.concat(['pets', 'art']);

            const options = optionsBuilder(argv);
            assert.deepStrictEqual(options.set, ['pets', 'art']);
        });

        it('is startrek if there is no strings after all the params', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.deepStrictEqual(options.set, ['startrek']);
        });
    });

    describe('user', () => {
        it('is <string> if -u <string> is present', () => {
            const argv = commandArgv.concat('-u', 'eddy.josafat');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.user, 'eddy.josafat');
        });

        it('is an empty string if -u<string> is present', () => {
            const argv = commandArgv.concat('-ueddy.josafat');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.user, '');
        });

        it('is an empty string if -u is not present', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.strictEqual(options.user, '');
        });
    });

    it('returns all options provided in the command line arguments', () => {
        const argv = commandArgv.concat([
            '-#',
            'whatever',
            '--dry-run',
            '-m',
            'you are legend',
            '-p',
            '3',
            '-u',
            'eddy.josafat',
            'art',
            'science',
        ]);
        const options = optionsBuilder(argv);
        assert.deepStrictEqual({
            add: false,
            hashtag: 'whatever',
            dryRun: true,
            message: 'you are legend',
            help: false,
            points: 3,
            user: 'eddy.josafat',
            set: ['art', 'science'],
        }, options);
    });
});
