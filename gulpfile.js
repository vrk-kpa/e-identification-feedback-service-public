var gulp = require('gulp');
var child_process = require('child_process');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');

gulp.task('server', function (cb) {
  mkdirp.sync('logs');
  var server = spawn('node', ['--harmony', 'src/app.js', '--configPath=config.yml']);
  server.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  server.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
});

gulp.task('test_server', function (cb) {
  mkdirp.sync('logs');
  var server = spawn('node', ['--harmony', 'src/http_server.js', '--configPath=config.yml']);
  server.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  server.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
});
