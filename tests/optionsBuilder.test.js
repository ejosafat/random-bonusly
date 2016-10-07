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
            const argv = commandArgv.concat('-phi');

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
            const argv = commandArgv.concat('-#hola-que-tal');

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
            const argv = commandArgv.concat('-m', 'hola');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.message, 'hola');
        });

        it('is an empty string if -m<string> is present', () => {
            const argv = commandArgv.concat('-mhola');

            const options = optionsBuilder(argv);
            assert.strictEqual(options.message, '');
        });

        it('is an empty string if -m is not present', () => {
            const argv = commandArgv;

            const options = optionsBuilder(argv);
            assert.strictEqual(options.message, '');
        });
    });
});

    // it('returns an options Hash based on the command line arguments', () => {
    //     let argv = [
    //         '/usr/local/Cellar/node/6.6.0/bin/node',
    //         '/usr/local/bin/random-bonusly',
    //         '-#',
    //         'whatever',
    //         // '--dry-run',
    //         // '-m "you are legend"',
    //         // '-p 3',
    //         // 'art',
    //         // 'science',
    //     ];
    //     const options = params(argv);
    //     assert.deepEqual({
    //         hashtag: 'whatever',
    //         // dryRun: true,
    //         // message: 'you are legend',
    //         // points: 3,
    //         // set: ['art', 'science'],
    //     }, options);
    // });

    // xit('provides sensible defaults', () => {
    //     const argv = [
    //         '/usr/local/Cellar/node/6.6.0/bin/node',
    //         '/usr/local/bin/random-bonusly',
    //     ];
    //     const options = params(argv);
    //     assert.deepEqual({
    //         hashtag: 'why-so-serious',
    //         dryRun: false,
    //         message: false,
    //         points: 1,
    //         set: ['startrek'],
    //     }, options);
    // });

