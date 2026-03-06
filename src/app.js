const express = require('express');
const auth = require('./middlewares/auth.middleware');
const errorHandler = require('./middlewares/error-handler.middleware');
const { createRequestLogger } = require('./middlewares/request-logger.middleware');
const routes = require('./routes');
const { REPORTS_DIR, LOGS_DIR, BACKUP_DIR } = require('./config/paths');
const { ensureDirectory } = require('./utils/file.utils');

const app = express();

ensureDirectory(LOGS_DIR, (err) => {
  if (err) {
    console.error('Erro ao criar a pasta de logs:', err);
  }
});

ensureDirectory(BACKUP_DIR, (err) => {
  if (err) {
    console.error('Erro ao criar a pasta de backup:', err);
  }
});

app.use(createRequestLogger(true));
app.use(createRequestLogger(false));

app.use('/reports', auth, express.static(REPORTS_DIR));
app.use(routes);
app.use(errorHandler);

module.exports = app;
