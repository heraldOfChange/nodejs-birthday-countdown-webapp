'use strict';

exports = module.exports = (express, HomepageController, viewRenderer) => {
  const router = express.Router();
  const controller = HomepageController.createController(viewRenderer);

  router.get('/favicon.ico', (req, res) => { res.sendStatus(204); });    // send a 204 for favicon.ico

  /* redirect http get '/' to https */
  // router.get('/', (req, res, next) =>{
  //   res.redirect('https://' + req.headers.host + req.url + 'app');
  // })

  router.get('/app', (req, res, next) => controller.indexAction(req, res, next));
  router.post('/app', (req, res, next) => controller.postAction(req, res, next));

  return router;
};

exports['@singleton'] = true;
exports['@require'] = [ 'express', 'homepageControllers/homepage-controller.js', 'lib/view-renderer-factory.js' ];