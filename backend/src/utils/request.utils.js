const headers = require('../constants/headers');

const getClientIp = (req) => {
  const forwarded = req.headers[headers.X_FORWARDED_FOR];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.connection.remoteAddress || req.socket?.remoteAddress || '';
};

const getOriginHost = (req) => req.headers[headers.HOST_ORIGEM]
  || req.headers[headers.X_CLIENT_HOST]
  || req.headers.host
  || null;

module.exports = {
  getClientIp,
  getOriginHost
};
