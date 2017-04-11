var gulp = require('gulp');
var sass = require("gulp-ruby-sass");
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var browser = require('browser-sync');
var browserSync = browser.create();
var reload      = browser.reload;
var server      = require('gulp-express');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('serve',['minify-css'],function(){
    server.run(['app.js']);
    
    browser({
        proxy: "localhost:7000"
    });
	gulp.watch("./src/scss/**/*.scss", ['minify-css']);
	gulp.watch("./*.html").on('change', reload);
    gulp.watch("./dist/js/*.js").on('change',reload);
});

gulp.task('sass',function(){
	return sass('./src/scss/pages/*.scss', {sourcemap: true})
		.on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '../../src/scss/pages/'
        }))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('autoprefixer',['sass'],function(){
    return gulp.src('./src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('minify-css',['autoprefixer'], function(){
    return gulp.src('./src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);