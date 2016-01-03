var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade        = require('gulp-jade');


gulp.task('jekyll-build', function (done) {
    // browserSync.notify(messages.jekyllBuild);
    console.log("building jekyll...");
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    console.log("reloading...");
    browserSync.reload();
});


gulp.task('jade', function () {
    return gulp.src('_jadefiles/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('_includes'));
})


gulp.task('sass', function () {
    console.log("compiling sass...");
    return gulp.src('assets/css/main.sass')
        .pipe(sass({
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css')) //insite, incase only css update
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css')); //build, incase full rebuild
});

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    console.log("serving site...");
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false,
    });
});

gulp.task('watch', function () {
    // watch sass files, compile on change
    gulp.watch('assets/css/**/*.*ss', ['sass']);
    // watch templates
    gulp.watch(['_jadefiles/*.jade'], ['jade']);
    //watch html and rebuild jekyll on change
    gulp.watch(['_config.yml','*.html', '_layouts/*.html', '_includes/*.html', '_posts/*'], ['jekyll-rebuild']);
});


gulp.task('default', ['browser-sync', 'watch']);
