'use strict';

exports = module.exports = (pathResolver, viewRenderer) =>
  viewRenderer.nunjucksViewRenderer(pathResolver.realpathSync(`${__dirname}/../areas/`));

exports['@require'] = [ 'fs', 'lib/view-renderer' ];
