const gulp = require('gulp');
const transform = require('gulp-transform');
const clean = require('gulp-clean');

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
        );

let rewrites = [
    { src: '/mixins/_grid-framework.scss', dest: 'mixins' },
    { src: '/mixins/_grid.scss', dest: 'mixins' },
    { src: '/_grid.scss', dest: '' },
    { src: '/_tables.scss', dest: '' },
    { 
        src: [
            '/utilities/_display.scss',
            '/utilities/_flex.scss',
            '/utilities/_spacing.scss'
        ],
        dest: 'utilities' 
    }
];

function rewriteBs() {
    // Use Promise.all so Gulp processes all streams properly instead of just the last one
    const tasks = rewrites.map(rewrite => {
        return new Promise((resolve, reject) => {
            gulp.src(rewrite.src, { 
                root: 'node_modules/bootstrap-for-qc-sdg/scss',
                allowEmpty: true // FIX: Tells Gulp to ignore missing files instead of crashing
            })
            .pipe(transform('utf-8', rewriteBootstrap))
            .pipe(gulp.dest('src/sdg/scss/vendor/bootstrap-rewrite/' + rewrite.dest))
            .on('end', resolve)
            .on('error', reject);
        });
    });

    return Promise.all(tasks);
}

exports.rewriteBs = gulp.series(rewriteBs);

const unused = ['dist/qc-sdg-design-tokens.js'];
exports.cleanUnused = function () {
    // FIX: gulp.watch needs a function callback, not an active stream
    gulp.watch('dist/*.js', function() {
        return gulp.src(unused, { allowEmpty: true }).pipe(clean());
    });
};