var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var lab = require('gulp-lab');

gulp.task('default', ['server', 'test']);

// Restart the server for changes.
gulp.task('server', function () {
    nodemon({ script: 'server.js', "ignore": ["test/*", "public/*"]});
});

//tests
gulp.task('test', function(){
    gulp.watch(['EasyChat/**', 'test/**'], function(){
        return gulp.src('test')
            .pipe(lab())
    });
});