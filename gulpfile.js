var gulp = require('gulp');
var g = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*'],
			replaceString: /\bgulp[\-.]/
		});
var browserSync = require('browser-sync'),
		del = require('del'),
		run = require('run-sequence');

var baseDir = 'site/src/';
var targetDir = 'site/assets/';

// Work tasks
	gulp.task('styles', function(){
		gulp.src(baseDir + 'less/main.less')
			.pipe(g.plumber({
				errorHandler: function (error) {console.log(error.message);this.emit('end');}}))
			// .pipe(g.lesshint())
			// .pipe(g.lesshint.reporter())
			.pipe(g.sourcemaps.init())
			.pipe(g.less())
			.pipe(g.sourcemaps.write())
			.pipe(g.autoprefixer('last 2 versions'))
			.pipe(g.rename({suffix: '.min'}))
			.pipe(g.cssnano())
			.pipe(gulp.dest(targetDir + 'css'))
			.pipe(browserSync.reload({stream:true}))
	});
	gulp.task('scripts', function(){
		gulp.src(baseDir + 'scripts/**/*.js')
			.pipe(g.plumber({
				errorHandler: function (error) {console.log(error.message);this.emit('end');
			}}))
			// .pipe(g.xo())
			//.pipe(g.rename({suffix: '.min'}))
			//.pipe(g.uglify())
			.pipe(gulp.dest(targetDir + 'js'))
			.pipe(browserSync.reload({stream:true}));
	});

// copy tasks
	gulp.task('images', function(){
		gulp.src(baseDir + 'assets/images/**/*')
			.pipe(g.cache(g.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
			.pipe(gulp.dest(targetDir + 'images/'));
	});
	gulp.task('fonts', function() {
		gulp.src(baseDir + 'assets/fonts/**/*')
			.pipe(g.changed(targetDir + 'fonts'))
			.pipe(gulp.dest(targetDir + 'fonts'));
	});
	gulp.task('vendors', function() {
		gulp.src([baseDir + 'assets/**/*.js', baseDir + 'assets/**/*.css'])
			.pipe(g.changed(targetDir))
			.pipe(gulp.dest(targetDir));
	});

// general tasks
	gulp.task('clean', function() {
		del(['site/assets/**', '!site/assets']);
	});
	gulp.task('copy', function() {
		run(['images', 'fonts', 'vendors']);
	});
	gulp.task('build', function() {
		run(['styles', 'scripts', 'copy']);
	});
	gulp.task('serve', function() {
		browserSync({
			proxy: "127.0.0.1:2000",
			online: false
		});
	});
	gulp.task('reload', function () {
		browserSync.reload();
	});

gulp.task('watch', function() {
	gulp.watch(baseDir + 'less/**/*.less', ['styles']);
	gulp.watch(baseDir + 'scripts/**/*.js', ['scripts']);
	gulp.watch(baseDir + 'views/**/*.jade', ['reload']);
});

gulp.task('default', ['build', 'serve', 'watch'], function(){
});
