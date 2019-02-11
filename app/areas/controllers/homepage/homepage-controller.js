'use strict';

class HomepageController {

  constructor(renderer, datastore) {
    this.homepageTemplate = 'homepage/homepage-template.njk';
    this.renderer = renderer;
    this.datastore = datastore.promisedDatastore();
  }

  renderPageWithData(req, res, data = {}) {
    const result = this.renderer.render(this.homepageTemplate, data);

    res.status(200);
    return res.end(result);
  }

  // page requests
  indexAction(req, res) {
    return this.renderPageWithData(req, res);
  }

  postAction(req, res) {
    // helper functions
    const queryIfDbConnected = databaseQuery => {
      return this.datastore
        .dbConnect(process.env.REDIS_PORT, process.env.REDIS_HOSTNAME, process.env.REDIS_CREDENTIALS)
        .then(databaseQuery)
        .catch(err => {    // umbrella error handler for exceptions that occur above.
          console.info('db error: ' + err.message);
          renderPage({ message: 'Oops! We could not do that, sorry.' });
        });
    };

    const renderPage = data => {
      data.name = req.body.name;
      return this.renderPageWithData(req, res, data);
    };

    const countRemainingDays = birthday => this.countDays(req.body.name, birthday);

    // database actions
    if (req.body.saveBtn)
      return queryIfDbConnected(datastoreClient => {
        if (!req.body.name.trim() || !req.body.date.trim())
          return renderPage({ message: 'please enter both a name & date.' });
        else {
          datastoreClient.setAsync(req.body.name, req.body.date);
          return renderPage({
            message: `saved! ${countRemainingDays(req.body.date)}`,
            date: req.body.date
          });
        }
      });

    if (req.body.loadBtn)
      return queryIfDbConnected(datastoreClient => {
        if (!req.body.name.trim())
          return renderPage({ message: 'please enter a name.' });
        else
          datastoreClient.getAsync(req.body.name)
            .then(loadedDate => {
              if (loadedDate !== null)
                return renderPage({
                  message: 'loaded datastore: ' + countRemainingDays(loadedDate),
                  date: loadedDate
                });
              else return renderPage({ message: `we don't have a record for ${req.body.name} yet :(` });
            });
      });

    return renderPage({ message: countRemainingDays(req.body.date), date: req.body.date });
  }


  countDays(enteredName, enteredDate) {
    if (enteredDate === '') return 'Please enter a date.';

    const birthday = new Date(enteredDate);
    const today = new Date();

    // Set current year or the next year if user already had a birthday this year
    birthday.setFullYear(today.getFullYear());
    if (today > birthday) birthday.setFullYear(today.getFullYear() + 1);
    const days = Math.ceil((birthday - today) / (1000 * 60 * 60 * 24));

    if (enteredName === '') enteredName = 'user';

    return 'Days to ' + enteredName + '\'s next birthday: ' + days;
  }
}

exports = module.exports = datastore => {
  return { createController: (renderer) => new HomepageController(renderer, datastore) };
};

exports['@singleton'] = true;
exports['@require'] = [ 'lib/redis-client' ];