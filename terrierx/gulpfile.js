var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css');

gulp.task('less', function () {
  return gulp.src('less/terrier.less')
    .pipe(less())
    .pipe(gulp.dest('dist'))
    .pipe(minify({keepBreaks: false}))
    .pipe(rename('terrier.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
  return gulp.src('js/terrier.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('terrier.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['less', 'js'], function () {
  gulp.watch('less/**/*.less', ['less']);
  gulp.watch('js/**/*.js', ['js']);
});

gulp.task('default', ['less', 'js']);