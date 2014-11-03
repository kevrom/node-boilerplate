'use strict';

var gulp         = require('gulp');
var gutil        = require('gulp-util');
var transform    = require('vinyl-transform');
var browserify   = require('browserify');
var merge        = require('merge-stream');
var concat       = require('gulp-concat');
var imagemin     = require('gulp-imagemin');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var nodemon      = require('gulp-nodemon');
var sass         = require('gulp-sass');
var minifyCss    = require('gulp-minify-css');
var minifyHtml   = require('gulp-minify-html');
var sourcemaps   = require('gulp-sourcemaps');
var del          = require('del');
var runSequence  = require('run-sequence');
var Notification = require('node-notifier');
var notifier     = new Notification();

// Gulp paths
var paths = {
	build: './dist',
	js: {
		all: ['./app.js', './gruntfile.js', './public/js/*.js', './server/**/*.js'],
		server: ['./app.js', './gruntfile.js', './server/**/*.js'],
		public: ['./public/js/*.js']
	},
	sass: './public/sass/*.scss',
	img: './public/img/**/*',
	fonts: './public/fonts/**/*'
};

var options = {};
options.sass = {
	errLogToConsole: true
};

// Clean up build directory
gulp.task('clean', function(cb) {
	del(paths.build, function(err) {
		if (err) { cb(err); }
		cb();
	});
});


// SASS compilation
gulp.task('styles', function() {
	return gulp.src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass(options.sass))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.build + '/css'));
});


// Javscript linting
gulp.task('lint', function() {
	return gulp.src(paths.js.all)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});


// Javascript assets pipeline
gulp.task('scripts', function() {
	var browserified = transform(function(file) {
		return browserify(file).bundle();
	});
	return gulp.src(['./public/js/main.js', './public/js/admin.js'])
		.pipe(browserified)
		.pipe(gulp.dest('./dist/js/'));
});


// Images
gulp.task('images', function() {
	return gulp.src(paths.img)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.build + '/img'));
});


// Fonts
gulp.task('fonts', function() {
	return gulp.src(paths.fonts)
		.pipe(gulp.dest(paths.build + '/fonts'));
});


// Vendor scripts and assets
gulp.task('vendor', function() {
	var bootstrap   = {};
	var fontawesome = {};
	var angular = {};
	var jquery, socketio;

	bootstrap.sass = gulp.src('./public/lib/bootstrap.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(options.sass))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.build + '/vendor/bootstrap'));

	bootstrap.js = gulp.src('./node_modules/bootstrap-sass/assets/javascripts/bootstrap.js')
		.pipe(gulp.dest(paths.build + '/vendor/bootstrap'));

	fontawesome.sass = gulp.src('./public/lib/font-awesome.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(options.sass))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.build + '/vendor/font-awesome'));

	fontawesome.fonts = gulp.src('./node_modules/font-awesome/fonts/*')
		.pipe(gulp.dest(paths.build + '/vendor/font-awesome'));

	angular.js = gulp.src('./node_modules/angular/lib/*')
		.pipe(gulp.dest(paths.build + '/vendor/angular'));

	angular.restangular = gulp.src('./node_modules/restangular/dist/*')
		.pipe(gulp.dest(paths.build + '/vendor/angular'));

	angular.uirouter = gulp.src('./node_modules/angular-ui-router/release/*')
		.pipe(gulp.dest(paths.build + '/vendor/angular'));

	jquery = gulp.src('./node_modules/jquery/dist/jquery.js')
		.pipe(gulp.dest(paths.build + '/vendor/jquery'));

	socketio = gulp.src('./node_modules/socket.io-client/socket.io.js')
		.pipe(gulp.dest(paths.build + '/vendor/socket.io'));

	return merge(
		bootstrap.sass,
		bootstrap.js,
		fontawesome.sass,
		fontawesome.fonts,
		angular.js,
		angular.restangular,
		angular.uirouter,
		jquery,
		socketio
	);
});



// Watch function
gulp.task('watch', function() {
	gulp.watch(paths.sass, ['styles']);
	gulp.watch(paths.js.public, ['lint', 'scripts']);
	gulp.watch(paths.img, ['images']);
});


// Dev server
gulp.task('develop', function() {
	return nodemon({
		script: 'server/index.js',
		verbose: true,
		ignore: [
			'README.md',
			'gulpfile.js',
			'.git/*',
			'node_modules/*',
			'public/*',
			'dist/*'
		]
	})
	.on('start', ['watch'])
	.on('change', ['lint', 'watch'])
	.on('restart', function() {
		notifier.notify({
			message: 'Development server started.'
		});
	});
});

gulp.task('build', function(cb) {
	runSequence(
		// clean build directory
		'clean',

		// run these in parallel
		[
			'lint',
			'scripts',
			'styles',
			'images',
			'vendor'
		],
		function(err) {
			if (err) { cb(err); }
			cb();
		}
	);
});

gulp.task('default', function() {
	runSequence(
		'build',
		// start dev server
		'develop'
	);
});
