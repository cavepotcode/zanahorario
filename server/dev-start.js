const chokidar = require('chokidar');
const nodemon = require('nodemon');
const child_process = require('child_process');

// run build first?
// throttle?

let restarting = false;

// On changes in TS files...
const watcher = chokidar.watch('./src/**/*.ts', {
  ignored: /[\/\\]\./, persistent: true
});

watcher.on('ready', function() {
  console.info("Starting...");
  watcher
    .on('add', build)
    .on('addDir', build)
    .on('change', build)
    .on('unlink', build)
    .on('unlinkDir', build)
    .on('error', build);

  startServer();
});

function build(path) {
  console.info("Change detected:", path);
  const result = require('child_process').execSync('kc build').toString();
  console.info("Finished building: ", result);
}

function startServer() {
  nodemon({
    script: './dist/default/src/server.js',
    ext: 'js'
  });

  nodemon.on('start', function () {
    restarting = false;
    console.info('Kiwi dev-server started! Watching files...');
  }).on('quit', function () {
    console.info('Stopping kiwi dev server...');
    watcher.close();
    process.exit();
  }).on('restart', function() {
    if (!restarting) {
      console.info('Restarting kiwi dev server...');
      restarting = true;
    }
  });
}
