var gulp = require('gulp');
var webpack = require('webpack');

function onBuild (name, done) {
  return function (err, stats) {
    if (err) {
      console.log('Error compiling ' + name, err);
    }

    if (stats) {
      console.log(stats.toString({
        colors: true,
        chunkModules: false
      }));
    }

    if (done) {
      done();
    }
  };
}

gulp.task('js:compile', function (done) {
  webpack(require('./webpack.config'), onBuild('js', done));
});

gulp.task('js:watch', function () {
  webpack(require('./webpack.config')).watch(100, onBuild('js'));
});

gulp.task('compile', ['js:compile']);
gulp.task('watch',   ['js:watch']);
