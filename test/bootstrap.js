const projectPath = process.cwd(),
  deleteDir = require('rimraf'),
  testTools = require('we-test-tools'),
  path = require('path');

let we;

before(function(callback) {
  this.slow(100);

  testTools.copyLocalConfigIfNotExitst(projectPath, function() {
    var We = require('we-core');
    we = new We();

    testTools.init({}, we);

    we.bootstrap({
      i18n: {
        directory: path.join(__dirname, 'locales'),
        updateFiles: true
      }
    } , function(err, we) {
      if (err) throw err;

      we.startServer(function(err) {
        if (err) throw err;
        callback();
      });
    });
  });
});

//after all tests
after(function (callback) {

  we.exit(()=> {
    let tempFolders = [
      projectPath + '/files/tmp',
      projectPath + '/files/config',
      projectPath + '/files/sqlite',
      projectPath + '/config/local.js',
    ];

    we.utils.async.each(tempFolders, function(folder, next){
      deleteDir( folder, next);
    }, function(err) {
      if (err) throw new Error(err);
      callback();
    });
  });

});