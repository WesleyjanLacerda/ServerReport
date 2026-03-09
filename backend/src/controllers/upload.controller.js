const fs = require('fs');
const path = require('path');
const { BACKUP_DIR } = require('../config/paths');
const headers = require('../constants/headers');
const { formatDateTimePtBr } = require('../utils/date.utils');
const { sanitizeFilename, sanitizePathSegment, resolvePathInsideBase } = require('../utils/path.utils');
const { getClientIp, getOriginHost } = require('../utils/request.utils');
const { insertBackupUploadLog } = require('../services/backup-upload-log.service');

const getLogLabel = (value) => {
  if (value == null) return '-';
  const normalized = String(value).trim();
  return normalized || '-';
};

const uploadBackup = (req, res) => {
  if (!req.file) {
    res.status(400).send('Nenhum arquivo enviado.');
    return;
  }

  const pasta = sanitizePathSegment(req.params.pasta);
  if (!pasta) {
    res.status(400).send('Parâmetro de pasta inválido.');
    return;
  }

  const safeFileName = sanitizeFilename(req.file.originalname);
  if (!safeFileName) {
    res.status(400).send('Nome de arquivo inválido.');
    return;
  }

  const empresa = req.headers[headers.EMPRESA];
  const usuario = req.headers[headers.USUARIO];
  const empresaLog = getLogLabel(empresa);
  const usuarioLog = getLogLabel(usuario);
  const dateTime = formatDateTimePtBr();
  const ip = getClientIp(req);
  const hostOrigem = getOriginHost(req);

  console.log(`[${dateTime}][${empresaLog}-${usuarioLog}][${pasta}] Backup de arquivo realizado ${ip}.`);

  const backupPath = resolvePathInsideBase(BACKUP_DIR, pasta);
  if (!backupPath) {
    res.status(400).send('Pasta de destino inválida.');
    return;
  }

  const filePath = path.join(backupPath, safeFileName);
  const finishSuccessFlow = () => {
    res.status(200).send('Arquivo enviado e salvo com sucesso.');
    insertBackupUploadLog({
      empresa: pasta,
      usuario,
      ipOrigem: ip,
      hostOrigem,
      caminhoArquivo: filePath,
      nomeArquivo: safeFileName,
      tamanhoBytes: req.file.size,
      dataHoraUpload: new Date(),
      status: 'SUCESSO',
      mensagemErro: null,
      webhookStatus: null,
      webhookResposta: null
    });
  };

  fs.mkdir(backupPath, { recursive: true }, (mkdirError) => {
    if (mkdirError) {
      insertBackupUploadLog({
        empresa: pasta,
        usuario,
        ipOrigem: ip,
        hostOrigem,
        caminhoArquivo: backupPath,
        nomeArquivo: safeFileName,
        tamanhoBytes: req.file.size,
        dataHoraUpload: new Date(),
        status: 'ERRO',
        mensagemErro: `Erro ao criar pasta de backup: ${mkdirError.message || mkdirError}`,
        webhookStatus: null,
        webhookResposta: null
      });
      res.status(500).send('Erro ao criar pasta de backup.');
      return;
    }

    if (path.resolve(req.file.path) === path.resolve(filePath)) {
      finishSuccessFlow();
      return;
    }

    fs.rename(req.file.path, filePath, (renameError) => {
      if (renameError) {
        insertBackupUploadLog({
          empresa: pasta,
          usuario,
          ipOrigem: ip,
          hostOrigem,
          caminhoArquivo: filePath,
          nomeArquivo: safeFileName,
          tamanhoBytes: req.file.size,
          dataHoraUpload: new Date(),
          status: 'ERRO',
          mensagemErro: `Erro ao mover arquivo: ${renameError.message || renameError}`,
          webhookStatus: null,
          webhookResposta: null
        });
        res.status(500).send('Erro ao mover arquivo para a pasta de backup.');
        return;
      }

      finishSuccessFlow();
    });
  });
};

module.exports = {
  uploadBackup
};
