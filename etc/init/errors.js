'use strict';

const getSmallGiphys = size => {
  const toMegabytes = num => {
    return num * 1000 * 1000;
  };

  return toMegabytes(1) < size < toMegabytes(15);
};

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

exports = module.exports = (renderer, giphy, createError) => {
  return {
    // eslint-disable-next-line no-unused-vars
    notFound: app => app.use((req, res, next) =>
      next(createError(404, res.send(renderer.render('error/404.njk'))))
    ),
    // eslint-disable-next-line no-unused-vars
    defaultHandler: (app) => app.use((error, req, res, next) => {
      res.status(error.statusCode || 500);
      const giphyAPI = giphy();
      giphyAPI.search({ q: 'no', limit: 1000 }, (err, img) => {
        const errorImages = img.data.map(giphyObjects => Object.values(giphyObjects.images)
          .filter(smallGiphys => getSmallGiphys(parseInt(smallGiphys.size)))
          .map(giphyUrl => giphyUrl.url)
        ).filter(giphyExists => giphyExists.length > 0);
        res.end(renderer.render('error/all.njk', { giphyImage: randomFromArray(errorImages) }));
      });
    })
  };
};

exports['@require'] = [ 'lib/view-renderer-factory', 'giphy-api', 'http-errors' ];