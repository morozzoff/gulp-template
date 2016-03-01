'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    server = require('gulp-server-livereload'),
    minifyHTML = require('gulp-minify-html'),
    wiredep = require('wiredep').stream,
    clean = require('gulp-clean'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

//Dev

gulp.task('start', ['js', 'sass']);

gulp.task('sass', function () {
  gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('app/css'))
});

gulp.task('js', function() {
  return gulp.src(['./js/my.js'])
    .pipe(concat('common.js'))
    .pipe(gulp.dest('./app/js/'));
});

gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory : "app/libs"
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('webserver', function() {
  gulp.src('./app/')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

//Build

gulp.task('build', ['fonts', 'images'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.html', minifyHTML()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('fonts', function () {
  gulp.src('app/fonts/*')
    .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('images', function () {
  gulp.src('app/images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images/'))
});

gulp.task('uglify', function() {
  gulp.src('./app/js/common.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('minifyHTML', function() {
  var opts = {
    conditionals: true,
    spare:true,
    comments: true
  };
  return gulp.src('./app/index.html')
  .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./dist/'));
});

//Watcher

gulp.task('watch', ['webserver'], function() {
  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch('./js/my.js', ['js']);
  gulp.watch('bower.json', ['bower']);
});
