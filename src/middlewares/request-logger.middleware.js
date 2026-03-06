const headers = require('../constants/headers');
const { writeLog } = require('../services/log-file.service');

const createRequestLogger = (includeHeaders) => (req, res, next) => {
  const ip = req.headers[headers.X_FORWARDED_FOR] || req.connection.remoteAddress;
  const logMessage = `Requisição para ${req.method} ${req.originalUrl} - IP: ${ip}`;

  if (includeHeaders) {
    writeLog(logMessage, {
      empresa: req.headers[headers.EMPRESA],
      usuario: req.headers[headers.USUARIO]
    });
  } else {
    writeLog(logMessage);
  }

  next();
};

module.exports = {
  createRequestLogger
};
