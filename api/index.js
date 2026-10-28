const app = require('../backend/server');

module.exports = (req, res) => {
  const matched = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'];
  if (matched && matched.startsWith('/api')) {
    req.url = matched;
  } else if (req.query && req.query.path) {
    const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    req.url = '/api/' + subpath.replace(/^\/+/, '');
  } else if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};
