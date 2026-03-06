const fs = require('fs');
const path = require('path');
const { REPORTS_DIR, REPORTS_DIR2, REPORTS_DIR3, REPORTS_DIR4 } = require('../config/paths');
const headers = require('../constants/headers');
const { formatDateTimePtBr } = require('../utils/date.utils');
const { sendZippedDirectory } = require('../services/zip.service');

const downloadZipFromDirectory = (baseDir, buildLogMessage) => (req, res) => {
  const pasta = req.params.pasta;
  const empresa = req.headers[headers.EMPRESA];
  const usuario = req.headers[headers.USUARIO];
  const dateTime = formatDateTimePtBr();
  const ip = req.headers[headers.X_FORWARDED_FOR] || req.connection.remoteAddress;

  console.log(buildLogMessage({ dateTime, empresa, usuario, pasta, ip }));

  const pastaPath = path.join(baseDir, pasta);
  fs.access(pastaPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send(`Pasta '${pasta}' não encontrada.`);
      return;
    }

    const zipFileName = `${pasta}.zip`;
    sendZippedDirectory(res, pastaPath, zipFileName);
  });
};

const downloadAllReports = downloadZipFromDirectory(
  REPORTS_DIR,
  ({ dateTime, empresa, usuario, pasta, ip }) => `[${dateTime}][${empresa}-${usuario}][${pasta}] Requisição para baixar todos os relatórios ${ip}.`
);

const downloadHeraLavUpdate = downloadZipFromDirectory(
  REPORTS_DIR2,
  ({ dateTime, empresa, usuario, pasta, ip }) => `[${dateTime}][${empresa}-${usuario}] Requisição para baixar .exe v.${pasta} - ${ip}.`
);

const downloadHeraErpUpdate = downloadZipFromDirectory(
  REPORTS_DIR3,
  ({ dateTime, empresa, usuario, pasta, ip }) => `[${dateTime}][${empresa}-${usuario}] Requisição para baixar .exe v.${pasta} - ${ip}.`
);

const downloadCommerceUpdate = downloadZipFromDirectory(
  REPORTS_DIR4,
  ({ dateTime, empresa, usuario, pasta, ip }) => `[${dateTime}][${empresa}-${usuario}] Requisição para baixar .exe v.${pasta} - ${ip}.`
);

module.exports = {
  downloadAllReports,
  downloadHeraLavUpdate,
  downloadHeraErpUpdate,
  downloadCommerceUpdate
};
