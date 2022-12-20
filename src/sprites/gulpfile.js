(function () {
    "use strict";

    var gulp = require('gulp'),
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

    gulp.task('generateSprite', function () {
        return gulp.src('./*.svg', { cwd: './svg' })
            .pipe(svgSprite(config))
            .pipe(gulp.dest('dist'));
    });
})();