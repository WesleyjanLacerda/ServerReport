const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('./middlewares/auth.middleware');
const errorHandler = require('./middlewares/error-handler.middleware');
const { createRequestLogger } = require('./middlewares/request-logger.middleware');
const routes = require('./routes');
const { REPORTS_DIR, LOGS_DIR, BACKUP_DIR } = require('./config/paths');
const env = require('./config/env');
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(createRequestLogger(true));
app.use(createRequestLogger(false));

app.use('/reports', auth, express.static(REPORTS_DIR));
app.use(routes);

if (fs.existsSync(env.frontendDistDir)) {
  app.use('/painel/assets', express.static(path.join(env.frontendDistDir, 'assets')));
  app.use('/painel', express.static(env.frontendDistDir));
  app.get('/painel/*', (req, res) => {
    res.sendFile(path.join(env.frontendDistDir, 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;
