'use strict';

exports = module.exports = (express, homepageRoutes, path, middleware, views, errorHandler) => {
  const app = express();

  middleware.setMiddleware(app);

  views.setView(app);

  /* redirect initial get to https */
  app.get('/', (req, res, next) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
  });

  app.use('/', homepageRoutes);

  errorHandler.defaultHandler(app);
  errorHandler.notFound(app);

  return app;
};

exports['@singleton'] = true;
exports['@require'] = [ 'express', 'homepageControllers/homepage-routes.js', 'path', 'init/middleware.js', 'init/views.js', 'init/errors.js' ];