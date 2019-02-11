'use strict';

exports = module.exports = (logger, express, path) => {
  return {
    setMiddleware: (app) => {
      app.use(logger('dev'));
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(express.static(path.join(__dirname, 'public')));
      app.use(express.static('public'));
    }
  };
};

exports['@require'] = [ 'morgan', 'express', 'path' ];