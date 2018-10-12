'use strict';

let gulp = require('gulp');
let merge = require('gulp-merge-json');
let del = require('del');
let utils = require('./utils');

gulp.task('environment', function () {
    gulp.src(['config/config.json', 'config/' + utils.getEnvName() + '_config.json'])
        .pipe(merge({
            fileName: 'config.json'
        }))
        .pipe(gulp.dest('./'));

    gulp.src(['config/' + utils.getEnvName() + '_swagger.json', 'config/swagger.json'])
        .pipe(merge({
            fileName: 'swagger.json'
        }))
        .pipe(gulp.dest('./swagger'));
});

gulp.task('clean:dist', function () {
    return del([
        'dist'
    ]);
});

gulp.task('build', ['environment']);
gulp.task('re-build', ['environment', 'clean:dist']);