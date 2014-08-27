var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');

gulp.task('default', ['server', 'watch']);

// Restart the server for changes.
gulp.task('server', function () {
    nodemon({ script: 'server.js', ext: 'js' });
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

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('public/css/admin/working/**', ['sass-admin']);
    gulp.watch('public/css/user/working/**', ['sass-user']);
});