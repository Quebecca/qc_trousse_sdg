import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import cssReplace from 'postcss-replace'
import pkg from './package.json';

const path = require('path');

function serve() {
    // Keep a reference to a spawned server process
    let server;

    function toExit() {
        // kill the server if it exists
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            // Spawn a child server process
            server = require('child_process').spawn(
                'npm',
                ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true,
                }
            );

            // Kill server on process termination or exit
            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        },
    };
}

const scssOptions = {
    processor: css =>
        postcss([
            autoprefixer(),
            cssReplace({
                data: {
                    'pkg-version' : pkg.version
                }
            })
        ]),
    sourceMap: true,
    includePaths: [
        path.join(__dirname, '../../node_modules/'),
        'node_modules/',
        'src/scss',
    ],
    // outputStyle: 'compressed',
    watch: 'src/scss'

};


let addQcNamespaceToBootstrapClasses = (contents, filename) =>
    contents
        .toString()
        .replace(
            /\.(container|row|col|order|offset|d|flex|justify|align|m|#)/g,
            '\.qc-$1'
        );
export default [
    {
        input: 'src/qc-catalog-sdg.js',
        output: {
            file: 'public/js/qc-catalog-sdg.js',
            format: 'iife'
        },
        plugins: [
            resolve({
                browser: true
            }),
            // serve(),
            // //Enable the Hot Reload
            // livereload('public'),
            scss(
                Object.assign(
                    scssOptions,
                    {output: 'public/css/qc-catalog-sdg.css'}
                )
            )
        ],
    },
    {
        // This `main.js` file we wrote
        input: 'src/qc-sdg.js',
        output: {
            file: 'dist/qc-sdg.js',
            format: 'iife',
        },
        plugins: [
            resolve({
                browser: true
            }),
            // code to generate bs files in /build
            // uncomment to re-generate…
            // copy({
            //     targets: [{
            //         src: 'node_modules/bootstrap/scss/mixins/_grid-framework.scss',
            //         dest: 'build/bootstrap/scss/mixins',
            //         transform: addQcNamespaceToBootstrapClasses
            //     },{
            //         src: 'node_modules/bootstrap/scss/_grid.scss',
            //         dest: 'build/bootstrap/scss',
            //         transform: addQcNamespaceToBootstrapClasses
            //     },{
            //         src: [
            //             'node_modules/bootstrap/scss/utilities/_display.scss',
            //             'node_modules/bootstrap/scss/utilities/_flex.scss',
            //             'node_modules/bootstrap/scss/utilities/_spacing.scss',
            //             ],
            //         dest: 'build/bootstrap/scss/utilities',
            //         transform: addQcNamespaceToBootstrapClasses
            //     },]
            // }),
            // will output compiled styles to output.css
            scss(Object.assign(scssOptions, {output: 'dist/css/qc-sdg.css'}))

        ],
    },
    {
        // token only css file
        input: 'src/qc-sdg-design-tokens.js',
        output: {
            file: 'dist/qc-sdg-design-tokens.js',
            format: 'iife',
        },
        plugins: [
            resolve({
                browser: true
            }),
            scss(
                Object.assign(
                    scssOptions,
                    {output: 'dist/css/qc-sdg-design-tokens.css'}
                )
            )
        ],
    },
    {
        // last process without output to move, copy, delete operations
        input: 'src/qc-sdg.js',
        watch: {
            skipWrite: true, // prevent output generation
        },
        plugins: [
            scss(), // needed, since the script contains scss…
            del({ // deletion of uneeded js files
                targets: [
                    'dist/qc-sdg.js',
                    'dist/qc-sdg-design-tokens.js'
                ],
                verbose: true
            }),
            copy({
                targets: [
                    {src: `assets/*`, dest: [`dist`,`public`]},
                    {src: [`dist/css/qc-sdg.css`,`dist/css/qc-sdg.css.map`], dest: `public/css`}
                ],
                verbose: true,
            }),
        ]
    },
];