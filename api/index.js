const app = require('../backend/server');

module.exports = (req, res) => {
  if (req.query && req.query.path) {
    const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    req.url = '/api/' + subpath.replace(/^\/+/, '');
  } else if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};
