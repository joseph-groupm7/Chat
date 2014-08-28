var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var lab = require('gulp-lab');
var order = require("gulp-order");
var concat = require("gulp-concat");

gulp.task('default', ['server', 'watch-sass', 'test', 'watch-admin-js', 'watch-client-js']);

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

//js
gulp.task('watch-admin-js', function(){
    gulp.watch('public/angular/admin/**/*.js', function(){
        return gulp
            .src("public/angular/admin/**/*.js")
            .pipe(concat("admin.js"))
            .pipe(gulp.dest("public"));
    });
});

gulp.task('watch-client-js', function(){
    gulp.watch('public/angular/admin/**/*.js', function(){
        return gulp
            .src("public/angular/admin/**/*.js")
            .pipe(concat("admin.js"))
            .pipe(gulp.dest("public"));
    });
});