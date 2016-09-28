const assert = require('assert');
const paramsBuilder = require('../app/paramsBuilder.js');

describe('paramsBuilder', () => {
    describe('dryRun', () => {
        it('is true if --dry-run is present in the command line', () => {
            const argv = [
                '/usr/local/Cellar/node/6.6.0/bin/node',
                '/usr/local/bin/random-bonusly',
                '--dry-run',
            ];

            const options = paramsBuilder(argv);
            assert(options.dryRun === true);
        });

        it('is false if --dry-run is not present in the command line', () => {
            const argv = [
                '/usr/local/Cellar/node/6.6.0/bin/node',
                '/usr/local/bin/random-bonusly',
            ];

            const options = paramsBuilder(argv);
            assert(options.dryRun === false);
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
