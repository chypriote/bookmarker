var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*'],
			replaceString: /\bgulp[\-.]/
		});
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync({
		proxy: "127.0.0.1:2000",
		online: false
	});
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});

gulp.task('images', function(){
	gulp.src('public/images/**/*')
		.pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('public/images/'));
});

gulp.task('styles', function(){
	gulp.src(['less/**/*.less'])
		.pipe(plugins.plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
		}}))
		.pipe(plugins.less())
		.pipe(plugins.autoprefixer('last 2 versions'))
		.pipe(gulp.dest('public/css/'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
	gulp.src(['public/js/**/*.js'])
		.pipe(plugins.plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
		}}))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('default', ['browser-sync'], function(){
	gulp.watch("public/js/**/*.js", ['scripts']);
	gulp.watch("less/**/*.less", ['styles']);
	gulp.watch("views/**/*.jade", ['bs-reload']);
});