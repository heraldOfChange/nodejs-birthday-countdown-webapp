'use strict';

exports = module.exports = (path) => {
  return {
    setView: (app) => {    // view engine setup
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'njk');
    }
  };
};

exports['@require'] = [ 'path' ];
