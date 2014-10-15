var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');
var lab = require('gulp-lab');
var order = require("gulp-order");
var concat = require("gulp-concat");

gulp.task('default', ['server', 'watch-sass', 'test', 'watch-js']);
gulp.task('init', ['sass-user', 'sass-admin', 'js-user', 'js-admin']);
gulp.task('production', [/* minify here */]);

// Restart the server for changes.
gulp.task('server', function () {
    nodemon({ script: 'server.js', "ignore": ["test/*", "public/*"]});
});

//scss watches
gulp.task('sass-admin', function() {
    gulp.src('public/css/admin/working/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css/admin/dist'))
        .pipe(livereload({ auto: false }));
});

gulp.task('sass-user', function() {
    gulp.src('public/css/user/working/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css/user/dist'))
        .pipe(livereload({ auto: false }));
});

gulp.task('watch-sass', function() {
    livereload.listen();
    gulp.watch('public/css/admin/working/**', ['sass-admin']);
    gulp.watch('public/css/user/working/**', ['sass-user']);
});

//tests
gulp.task('test', function(){
    gulp.watch(['EasyChat/**', 'test/**'], function(){
        return gulp.src('test')
            .pipe(lab())
    });
});

gulp.task('js-admin', function(){
    return gulp
        .src("public/js/admin/working/**/*.js")
        .pipe(concat("admin.js"))
        .pipe(gulp.dest("public/js/admin/dist"));
});

gulp.task('js-user', function(){
    return gulp
        .src("public/js/user/working/**/*.js")
        .pipe(concat("user.js"))
        .pipe(gulp.dest("public/js/user/dist"));
});

gulp.task('watch-js', function(){
    gulp.watch('public/js/admin/working/**/*.js', ['js-admin']);
    gulp.watch('public/js/user/working/**/*.js', ['js-user']);
});