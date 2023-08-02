const
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    svgSprite = require('gulp-svg-sprite'),

    // Configuration
    config = {
        mode: {
            view: {
                bust: false,
                layout: "vertical"
            }

        },
        shape: {
            spacing: { // Spacing related options
                padding: 1, // Padding around all shapes
                box: 'content' // Padding strategy (similar to CSS `box-sizing`)
            }
        },
        svg: {
            precision: 0,
            dimensionAttributes: false
        }
    };

function doGenerateSprite() {
    return gulp.src('./*.svg', { cwd: './svg' })
        .pipe(svgSprite(config))
        .pipe(gulp.dest('dist'));;
}

function copy() {
    return gulp.src('./sprite.view.svg', { cwd: './dist/view/svg' })
            .pipe(rename('qc-sprite.svg'))
            .pipe(gulp.dest('img', {cwd: ['../../dist']}))
            .pipe(gulp.dest('img', {cwd: ['../../public']}))
        ;
}

exports.generateSprite =  gulp.series(doGenerateSprite,copy)