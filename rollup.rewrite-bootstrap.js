import svelte from 'rollup-plugin-svelte';
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'


let rewriteBootstrap = (contents, filename) =>
    contents
        .toString()
        // add qc- namespace prefix to bootstrap grid classes
        .replace(
            /\.(container|row|col|order|offset|d|flex|justify|align|m|#)/g,
            '\.qc-$1'
        )
        // replace gutter calc, based on token
        .replace(
            /(-?)\$gutter \* \.5/g,
            'calc($11 * $gutter / 2)'
        )
;

export default [{
    input: 'src/qc-sdg.js',
    watch: {
        skipWrite: true, // prevent output generation
    },
    plugins: [
        svelte(),
        scss({output: false}), // needed, since the script contains scss…
        copy({
            targets: [{
                src: 'node_modules/bootstrap/scss/mixins/_grid-framework.scss',
                dest: 'src/scss/modules/bootstrap-rewrite/mixins',
                transform: rewriteBootstrap
            },{
                src: 'node_modules/bootstrap/scss/mixins/_grid.scss',
                dest: 'lib/bootstrap/scss/mixins',
                transform: rewriteBootstrap
            }, {
                src: 'node_modules/bootstrap/scss/_grid.scss',
                dest: 'src/scss/modules/bootstrap-rewrite',
                transform: rewriteBootstrap
            }, {
                src: [
                    'node_modules/bootstrap/scss/utilities/_display.scss',
                    'node_modules/bootstrap/scss/utilities/_flex.scss',
                    'node_modules/bootstrap/scss/utilities/_spacing.scss',
                ],
                dest: 'src/scss/modules/bootstrap-rewrite/utilities',
                transform: rewriteBootstrap
            },]
        })
    ]
}];




