/**
 * Created by dpc20 on 11/26/2016.
 */
const gulp = require('gulp');
const sass = require('gulp-sass');


const PATHS = {
    sass: './src/webapp/assets/style.scss',
    index: './src/index.*',
    server: './src/server/**/*.js',
    assets: './src/webapp/assets/**/*.*',
    target: {
        root: './dist/',
        webapp: './dist/webapp/',
        assets: './dist/webapp/assets/',
        server: './dist/server/'
    }
};

gulp.task('sass', () => {
    return gulp.src(PATHS.sass)
        .pipe(sass())
        .pipe(gulp.dest(PATHS.target.webapp))
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

gulp.task('watch', function () {
    gulp.watch(PATHS.sass, ['sass']);
    gulp.watch(PATHS.index, ['index']);
    gulp.watch(PATHS.assets, ['assets']);
    gulp.watch(PATHS.server, ['server']);
});

gulp.task('default', ['sass', 'index', 'assets', 'server', 'watch']);