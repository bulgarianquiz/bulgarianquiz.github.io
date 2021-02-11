var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');

gulp.task('scripts', function () {
    return gulp.src('scripts/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', function () {
    return gulp.src('styles/**/*.css')
        .pipe(postcss())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel('scripts', 'styles'));

gulp.task('watch', function () {
    gulp.watch('scripts/**/*.js', gulp.series('scripts'));
    gulp.watch('styles/**/*.css', gulp.series('styles'));
});
