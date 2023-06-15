const svelte = require('rollup-plugin-svelte');
const resolve = require('@rollup/plugin-node-resolve');
const css = require('rollup-plugin-css-only');
const livereload = require('rollup-plugin-livereload');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const scss = require('rollup-plugin-scss');
const copy = require('rollup-plugin-copy');
const del = require('rollup-plugin-delete');
const replace = require('@rollup/plugin-replace');
const gulp = require('gulp');
const transform = require('gulp-transform');
// import del from 'del'
const clean = require('gulp-clean')


let rewriteBootstrap = (contents, filename) =>
    contents
        .toString()
        // add qc- namespace prefix to bootstrap grid classes
        .replace(
            /\.(container|row|col|order|offset|d|flex|justify|align|m|#|table)/g,
            '\.qc-$1'
        )
        // replace gutter calc, based on token
        .replace(
            /(-?)\$gutter \* \.5/g,
            'calc($11 * $gutter / 2)'
        )
;
let rewrites =
    [   { src: '/mixins/_grid-framework.scss'
        , dest: 'mixins'
        }
    ,   { src: '/mixins/_grid.scss'
        , dest: 'mixins'
        }
    ,   { src: '/_grid.scss'
        , dest: ''
        }
    ,   { src: '/_tables.scss'
        , dest: ''
        }
    ,   { src:
            [ '/utilities/_display.scss'
            , '/utilities/_flex.scss'
            , '/utilities/_spacing.scss'
            ]
        , dest: 'utilities'
        }
    ]
function rewriteBs() {
    let stream;
    rewrites.forEach(
        rewrite => {
                stream =
                    gulp
                        .src( rewrite.src, { root : 'node_modules/bootstrap-for-qc-sdg/scss'})
                        .pipe(transform('utf-8', rewriteBootstrap))
                        .pipe(gulp.dest( 'vendor/bootstrap-rewrite/' + rewrite.dest))
        }
    )
    return stream;
}


exports.rewriteBs = gulp.series(rewriteBs)


const unused = ['dist/qc-sdg-design-tokens.js'];
exports.cleanUnused = function () {
    gulp.watch('dist/*.js', gulp.src(unused).pipe(clean()))
}