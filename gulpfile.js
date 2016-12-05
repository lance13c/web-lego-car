/**
 * Created by dpc20 on 11/26/2016.
 */
const gulp = require('gulp');
const sass = require('gulp-sass');


const PATHS = {
    sass: './src/webapp/assets/style.scss',
    index: './src/index.*',
    server: './src/server/**/*.*',
	  dependencies: './dep/**/*.*',
    assets: './src/webapp/assets/**/*.*',
	  webapp_js: './src/webapp/js/**/*.js',
    target: {
        root: './dist/',
        webapp: './dist/webapp/',
	      webapp_js: './dist/webapp/js/',
        assets: './dist/webapp/assets/',
        server: './dist/server/',
	      dependencies: './dist/dep/'
    }
};

gulp.task('sass', () => {
    return gulp.src(PATHS.sass)
        .pipe(sass())
        .pipe(gulp.dest(PATHS.target.webapp))
});

gulp.task('webapp_js', () => {
	return gulp.src(PATHS.webapp_js)
		.pipe(gulp.dest(PATHS.target.webapp_js))
});

gulp.task('index', () => {
    return gulp.src(PATHS.index)
        .pipe(gulp.dest(PATHS.target.root))
});

gulp.task('assets', () => {
    return gulp.src(PATHS.assets)
        .pipe(gulp.dest(PATHS.target.assets))
});

gulp.task('server', () => {
    return gulp.src(PATHS.server)
        .pipe(gulp.dest(PATHS.target.server))
});

gulp.task('dependencies', () => {
	return gulp.src(PATHS.dependencies)
		.pipe(gulp.dest(PATHS.target.dependencies))
});

gulp.task('watch', function () {
    gulp.watch(PATHS.sass, ['sass']);
    gulp.watch(PATHS.index, ['index']);
    gulp.watch(PATHS.webapp_js, ['webapp_js']);
    gulp.watch(PATHS.assets, ['assets']);
    gulp.watch(PATHS.server, ['server']);
    gulp.watch(PATHS.dependencies, ['dependencies']);
});

gulp.task('default', ['sass', 'index', 'webapp_js', 'assets', 'server', 'dependencies', 'watch']);