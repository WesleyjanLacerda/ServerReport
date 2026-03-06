const basicAuth = require('basic-auth');
const env = require('../config/env');

const auth = (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== env.basicAuthUser || user.pass !== env.basicAuthPass) {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
    return;
  }
  next();
};

module.exports = auth;
