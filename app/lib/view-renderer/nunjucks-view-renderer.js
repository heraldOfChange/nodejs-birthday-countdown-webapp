'use strict';

exports = module.exports = viewRenderEngine => {
  return {
    nunjucksViewRenderer: filePath => {
      viewRenderEngine.configure(filePath);
      return viewRenderEngine;
    }
  };
};

exports['@require'] = [ 'nunjucks' ];