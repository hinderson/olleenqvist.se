'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var fileExists = require('file-exists');
var webpack = require('webpack');
var watch = require('gulp-watch');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var webpackConfig = require('./webpack.config.js');
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var awspublish = require('gulp-awspublish');
var cloudfront = require('gulp-cloudfront');
var RevAll = require('gulp-rev-all');
var path = require('path');
var runSequence = require('run-sequence');

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

// Post CSS task for use in development
gulp.task('css:dev', function ( ) {
    return gulp.src('./assets/css/main.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(postCssProcessors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'));
});

// Post CSS task for use in production
gulp.task('css:prod', function ( ) {
	return gulp.src('./assets/css/main.css')
		.pipe(postcss(postCssProcessors))
		.pipe(gulp.dest('./dist/css'));
});

// Webpack task for use in development
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

// Webpack task for use in production
gulp.task('webpack:prod', function (callback) {
	// Modify/overwrite some default webpack config options
	var prodConfig = Object.create(webpackConfig);

	prodConfig.output = {
		filename: 'main.js',
		path: './dist/js',
		publicPath: '/js/'
	};

	prodConfig.plugins = prodConfig.plugins.concat(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			'drop_console': true
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"production"'
			}
		})
	);

	webpack(prodConfig, function (err, stats) {
		if (err) throw new gutil.PluginError('webpack:prod', err);

		callback();
	});
});

gulp.task('optimize-thumbs', function ( ) {
    return gulp.src('./thumbs/*.jpg')
        .pipe(imageminJpegtran({progressive: true})())
        .pipe(gulp.dest('./thumbs'));
});

// Default dev watch task
gulp.task('watch', function ( ) {
    gulp.watch('./thumbs/*.jpg', ['optimize-thumbs']);
	gulp.watch('./assets/css/*.css', ['css:dev']);
    gulp.watch(['./assets/js/**/*'], ['webpack:dev']);
});

// Cachebusting
gulp.task('rev-assets', function ( ) {
	var revAll = new RevAll({
		transformFilename: function (file, hash) {
			var ext = path.extname(file.path);
			return path.basename(file.path, ext) + '-' + hash.substr(0, 8) + ext;
		},
		fileNameManifest: 'rev-manifest.json'
	});

	// Rev the files and create a manifest with references to them
	gulp.src([
			'./dist/css/main.css',
			'./dist/js/main.js',
		])
		.pipe(revAll.revision())
		.pipe(gulp.dest('./dist/'))
		.pipe(revAll.manifestFile())
		.pipe(gulp.dest('./assets/'));
});

// Amazon S3/Cloudfront tasks
var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};
var aws = require('./config/private/aws.json');
var publisher = awspublish.create(aws);

gulp.task('publish-assets', function ( ) {
	gulp.src(['./dist/**/*.{js,css,woff2,woff,png,jpg}'])
		.pipe(awspublish.gzip())
		.pipe(publisher.publish(headers))
		.pipe(awspublish.reporter())
		.pipe(cloudfront(aws));
});


// Generates rev'd asset files and deploys them to Amazon S3 and Cloudfront
gulp.task('deploy', function (done) {
	runSequence(
		'css:prod',
        'webpack:prod',
		'rev-assets',
		'publish-assets',
	done);
});



// Use s3cmd for more reliable continuous deployment of content like thumbs and regular images
var exec = require('child_process').exec;

gulp.task('s3-sync-thumbs', function (cb) {
	exec('s3cmd sync ./thumbs/ s3://olleenqvist.se/thumbs/ --acl-public --add-header="Cache-Control:max-age=315360000, no-transform, public"', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('s3-sync-content', function (cb) {
	exec('s3cmd sync ./content/ s3://olleenqvist.se/content/ --acl-public --add-header="Cache-Control:max-age=315360000, no-transform, public"', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('watch-thumbs', function ( ) {
	watch('./thumbs/**/*', function ( ) {
        gulp.start('s3-sync-thumbs');
	});
});

gulp.task('watch-content', function ( ) {
	watch('./content/**/*', ['s3-sync-content']);
});

// Default watch task for use in production in conjunction with a daemon (Forever in our case)
gulp.task('production', function ( ) {
	gulp.start('watch-content');
	gulp.start('watch-thumbs');
});

gulp.task('default', ['optimize-thumbs', 'css:dev', 'webpack:dev']);
