'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var watch = require('gulp-watch');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var webpackConfig = require('./webpack.config.js');
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');

// PostCSS tasks
var postCssProcessors = [
    require('postcss-import'),
    require('postcss-custom-media'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-inline-comment'),
    require('autoprefixer')({ browsers: ['last 2 versions', '> 2%'] }),
    require('csswring')
];

gulp.task('css:dev', function ( ) {
    return gulp.src('./assets/css/main.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(postCssProcessors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('webpack:dev', function (callback) {
    // Modify/overwrite some default webpack config options
    var devConfig = Object.create(webpackConfig);

    devConfig.devtool = 'sourcemap';
    devConfig.debug = true;

    webpack(devConfig, function (err, stats) {
        if (err) { throw new gutil.PluginError('webpack:dev', err); }

        gutil.log('[webpack:dev]', stats.toString({
            colors: true
        }));

        callback();
    });
});

gulp.task('optimize-thumbs', function ( ) {
    return gulp.src('./thumbs/*.jpg')
        .pipe(imageminJpegtran({progressive: true})())
        .pipe(gulp.dest('./thumbs'));
});

gulp.task('watch', function ( ) {
    gulp.watch('./thumbs/*.jpg', ['optimize-thumbs']);
	gulp.watch('./assets/css/*.css', ['css:dev']);
    gulp.watch(['./assets/js/**/*'], ['webpack:dev']);
});

gulp.task('default', ['optimize-thumbs', 'css:dev', 'webpack:dev']);
