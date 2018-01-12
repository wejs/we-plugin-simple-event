/**
 * We.js simple event plugin main file
 */

const mFindAll = require('./lib/metatags/findAll.js'),
  mFindOne = require('./lib/metatags/findOne.js');

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setConfigs({
    permissions: {
      'access_simple-event_unpublished': {
        'title': 'Access unpublished simple events'
      }
    },
  });

  plugin.setResource({
    name: 'simple-event',
    findAll: { metatagHandler: 'simple-eventFindAll' },
    findOne: { metatagHandler: 'simple-eventFindOne' }
  });

  plugin.setMetatagHandlers = function setMetatagHandlers(we) {
    if (we.router.metatag && we.router.metatag.add) {
      we.router.metatag.add('simple-eventFindAll', mFindAll);
      we.router.metatag.add('simple-eventFindOne', mFindOne);
    }
  }

  /**
   * Plugin fast loader for speed up We.js project bootstrap
   *
   * @param  {Object}   we
   * @param {Function} done    callback
   */
  plugin.fastLoader = function fastLoader(we, done) {
    // - Controllers:
    we.controllers['simple-event'] = new we.class.Controller( require('./server/controllers/simple-event.js') );
    // - Models:
    we.db.modelsConfigs['simple-event'] = require('./server/models/simple-event.js')(we);

    done();
  }

  plugin.setCanonicalURL = require('./lib/metatags/setCanonicalURL.js');

  plugin.events.on('we:after:load:plugins', plugin.setMetatagHandlers);

  return plugin;
};