var gulp = require('gulp');
var g = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*'],
			replaceString: /\bgulp[\-.]/
		});
var browserSync = require('browser-sync');
var cssnext = require('postcss-cssnext');
var cssnano = require('cssnano');
var reporter = require('postcss-reporter');
var browser = require('postcss-browser-reporter');
var handler = function (error) {console.log(error.message);this.emit('end');};

gulp.task('browser-sync', function() {
	browserSync({
		proxy: "localhost:2000",
		online: false
	});
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});

gulp.task('images', function(){
	return gulp.src('public/images/**/*')
		.pipe(g.plumber({errorHandler: handler}))
		.pipe(g.cache(g.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('public/images/'));
});

gulp.task('styles', function(){
	return gulp.src(['less/**/*.less'])
		.pipe(g.plumber({errorHandler: handler}))
		.pipe(g.sourcemaps.init())
		.pipe(g.less())
		.pipe(g.postcss([
			cssnext({warnForDuplicates: false}),
			cssnano(),
			reporter(),
			browser(),
		]))
		.pipe(gulp.dest('public/css/'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
	return gulp.src(['public/js/**/*.js'])
		.pipe(g.plumber({errorHandler: handler}))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('build', gulp.parallel('styles', 'scripts', 'images'));

gulp.task('default', gulp.series('browser-sync', function(){
	gulp.watch("public/js/**/*.js", ['scripts']);
	gulp.watch("less/**/*.less", ['styles']);
	gulp.watch("views/**/*.pug", ['bs-reload']);
}));
