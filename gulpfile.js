'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var watch = require('gulp-watch');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-import');
var csswring = require('csswring');
var webpackConfig = require('./webpack.config.js');
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');

gulp.task('css', function ( ) {
    return gulp.src('./assets/css/main.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([
            postcssImport(),
            autoprefixer({ browsers: ['> 5%'] }),
            csswring
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('optimize-thumbs', function ( ) {
    return gulp.src('./thumbs/*.jpg')
        .pipe(imageminJpegtran({progressive: true})())
        .pipe(gulp.dest('./thumbs'));
});

gulp.task('watch', function ( ) {
    gulp.watch('./thumbs/*.jpg', ['optimize-thumbs']);
	gulp.watch('./assets/css/*.css', ['css']);
    gulp.watch(['./assets/js/**/*'], ['webpack:build-dev']);
});
