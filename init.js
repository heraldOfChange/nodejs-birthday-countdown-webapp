'use strict';

const ioc = require('electrolyte');

// node_module inclusions
ioc.use(ioc.node_modules());

// component inclusions
ioc.use(ioc.dir('bin'));
ioc.use(ioc.dir('app'));
ioc.use('init', ioc.dir('etc/init'));
ioc.use('homepageControllers', ioc.dir('app/areas/controllers/homepage'));
ioc.use('lib', ioc.dir('app/lib'));

// create an instance of server
ioc.create('server.js');