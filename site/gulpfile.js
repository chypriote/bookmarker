var gulp = require('gulp');
var g = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*'],
			replaceString: /\bgulp[\-.]/
		});
var browserSync = require('browser-sync'),
		del = require('del'),
		run = require('run-sequence');

gulp.task('serve', function() {
	browserSync({
		proxy: "127.0.0.1:2000",
		online: false
	});
});
gulp.task('reload', function () {
	browserSync.reload();
});

gulp.task('styles', function(){
	gulp.src(['src/less/main.less'])
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
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.reload({stream:true}))
});
gulp.task('scripts', function(){
	gulp.src(['src/scripts/**/*.js'])
		.pipe(g.plumber({
			errorHandler: function (error) {console.log(error.message);this.emit('end');
		}}))
		.pipe(g.xo())
		//.pipe(g.rename({suffix: '.min'}))
		//.pipe(g.uglify())
		.pipe(gulp.dest('public/js'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('images', function(){
	gulp.src('src/images/**/*')
		.pipe(g.cache(g.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('public/images/'));
});
gulp.task('fonts', function() {
	gulp.src('src/fonts/**/*')
		.pipe(g.changed('public/fonts'))
		.pipe(gulp.dest('public/fonts'));
});
gulp.task('vendors', function() {
	gulp.src('src/vendors/**/*')
		.pipe(g.changed('public/'))
		.pipe(gulp.dest('public/'));
});

gulp.task('copy', function() {
	run(['images', 'fonts', 'vendors']);
});
gulp.task('build', function() {
	run(['styles', 'scripts', 'copy']);
});

gulp.task('watch', function() {
	gulp.watch('src/less/**/*.less', ['styles']);
	gulp.watch('src/scripts/**/*.js', ['scripts']);
	gulp.watch('src/views/**/*.jade', ['reload']);
});

gulp.task('default', ['build', 'serve', 'watch'], function(){
});
