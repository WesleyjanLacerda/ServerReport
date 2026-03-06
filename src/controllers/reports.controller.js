const fs = require('fs');
const { REPORTS_DIR } = require('../config/paths');
const { formatDateTimePtBr } = require('../utils/date.utils');
const headers = require('../constants/headers');

const listReports = (req, res) => {
  const dateTime = formatDateTimePtBr();
  const ip = req.headers[headers.X_FORWARDED_FOR] || req.connection.remoteAddress;
  console.log(`[${dateTime}] Requisição de consulta ${ip}.`);

  fs.readdir(REPORTS_DIR, (err, files) => {
    if (err) {
      res.status(500).send('Não foi possível listar os arquivos.');
      return;
    }

    res.json(files);
  });
};

module.exports = {
  listReports
};
