'use strict';

// module imports
const cheerio = require('cheerio');
const ioc = require('electrolyte');

ioc.use(ioc.node_modules());
ioc.use('lib', ioc.dir('app/lib'));
ioc.use('homepageControllers', ioc.dir('app/areas/controllers/homepage'));

/* controller promises. Simulate actual use of controller component as an IoC dependency */
const viewRenderer = ioc.create('lib/view-renderer-factory.js');
const controller = ioc.create('homepageControllers/homepage-controller.js');

const controllerIndexAction = (req, res) =>
  viewRenderer.then(vr => {
    return controller.then(result => {
      return result.createController(vr).indexAction(req, res);
    });
  });
const controllerPostAction = (req, res) =>
  viewRenderer.then(vr => {
    return controller.then(result => {
      return result.createController(vr).postAction(req, res);
    });
  });
const controllerCountDays = (user, date) =>
  viewRenderer.then(vr => {
    return controller.then(result => {
      return result.createController(vr).countDays(user, date);
    });
  });

// body model. content on page to test.
const body = { name: '', date: '' };

describe('Tests birthday counter home page', () => {
  describe('Tests indexAction from controller', () => {
    it('Has the correct title', () => {
      const req = {};
      const res = {
        status: statusCode => {
          expect(statusCode).toBe(200);
        },
        end: response => {
          let $ = cheerio.load(response);
          return $('.title').text();
        }
      };

      return controllerIndexAction(req, res).then(result => {
        expect(result).toBe('NodeJS - Birthday Countdown');
      });
    });

    it('The form has 5 input fields', () => {
      const req = {};
      const res = {
        status: statusCode => {
          expect(statusCode).toBe(200);
        },
        end: response => {
          let $ = cheerio.load(response);
          return $('#birthday_count_form').find(':input').length;
        }
      };

      return controllerIndexAction(req, res).then(result => {
        expect(result).toBe(5);
      });
    });

    it('The days label is empty when loading the page', () => {
      const req = {};
      const res = {
        status: statusCode => {
          expect(statusCode).toBe(200);
        },
        end: response => {
          let $ = cheerio.load(response);
          return $('#days_label').text();
        }
      };

      return controllerIndexAction(req, res).then(result => {
        expect(result).toBe('');
      });
    });
  });

  describe('Tests postAction in controller', () => {
    it('Name field has the correct value after submitting form', () => {
      body.name = 'Martijn';
      const req = { body };
      const res = {
        status: statusCode => {
          expect(statusCode).toBe(200);
        },
        end: response => {
          let $ = cheerio.load(response);
          return $('#name_form_id').val();
        }
      };

      return controllerPostAction(req, res).then(result => {
        expect(result).toBe('Martijn');
      });
    });

    it('Name field has the correct value after submitting form', () => {
      body.date = '04-06-2018';
      const req = { body };
      const res = {
        status: statusCode => {
          expect(statusCode).toBe(200);
        },
        end: response => {
          let $ = cheerio.load(response);
          return $('#date_form_id').val();
        }
      };

      return controllerPostAction(req, res).then(result => {
        expect(result).toBe('04-06-2018');
      });
    });

    it('Days label has the correct text when submitting tomorrow as a date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      body.name = 'Martijn';
      body.date = tomorrow.getMonth() + 1 + '-' + tomorrow.getDate() + '-' + tomorrow.getFullYear();

      const req = { body };
      const res = {
        status: statusCode => {
          expect(statusCode).toBe(200);
        },
        end: response => {
          let $ = cheerio.load(response);
          return $('#days_label').text();
        }
      };

      return controllerPostAction(req, res).then(result => {
        expect(result).toBe('Days to Martijn\'s next birthday: 1');
      });
    });
  });

  describe('Tests countDays function in controller', () => {
    it('Returns the correct string when no value is given to the countdays function', () => {
      return controllerCountDays('', '').then(result => {
        expect(result).toBe('Please enter a date.');
      });
    });

    it('Returns the correct string with 1 day from now when entering tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tomorrowDate = tomorrow.getMonth() + 1 + '-' + tomorrow.getDate() + '-' + tomorrow.getFullYear();

      return controllerCountDays('Martijn', tomorrowDate).then(result => {
        expect(result).toBe('Days to Martijn\'s next birthday: 1');
      });
    });

    it('Shows "user" as the users name when no name is entered', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tomorrowDate = tomorrow.getMonth() + 1 + '-' + tomorrow.getDate() + '-' + tomorrow.getFullYear();

      return controllerCountDays('', tomorrowDate).then(result => {
        expect(result).toBe('Days to user\'s next birthday: 1');
      });
    });

    it('Returns the correct string when entered a date 1 day ago', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayDate = yesterday.getMonth() + 1 + '-' + yesterday.getDate() + '-' + yesterday.getFullYear();

      return controllerCountDays('Martijn', yesterdayDate).then(result => {
        expect(result).toBe('Days to Martijn\'s next birthday: 364');
      });
    });
  });
});
