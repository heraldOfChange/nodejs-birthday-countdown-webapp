'use strict';

exports = module.exports = (ioc, serverModule) => {
  return ioc.create('app').then(app => {
    serverModule(app);
  }).catch((err) => {
    console.error(err.message);
  });
};

exports['@require'] = [ 'electrolyte', 'server-module' ];