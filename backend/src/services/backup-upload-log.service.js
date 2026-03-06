const { attach, detach } = require('./firebird.service');
const { truncateText } = require('../utils/text.utils');

const insertBackupUploadLog = async (record) => {
  const sql = `
    INSERT INTO BACKUP_UPLOAD_LOG (
      EMPRESA,
      USUARIO,
      IP_ORIGEM,
      HOST_ORIGEM,
      CAMINHO_ARQUIVO,
      NOME_ARQUIVO,
      TAMANHO_BYTES,
      DATA_HORA_UPLOAD,
      STATUS,
      MENSAGEM_ERRO,
      WEBHOOK_STATUS,
      WEBHOOK_RESPOSTA
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    truncateText(record.empresa, 120),
    truncateText(record.usuario, 120),
    truncateText(record.ipOrigem, 45),
    truncateText(record.hostOrigem, 255),
    truncateText(record.caminhoArquivo, 500),
    truncateText(record.nomeArquivo, 255),
    Number.isFinite(record.tamanhoBytes) ? record.tamanhoBytes : null,
    record.dataHoraUpload || new Date(),
    truncateText(record.status || 'SUCESSO', 20),
    truncateText(record.mensagemErro, 1000),
    truncateText(record.webhookStatus, 20),
    truncateText(record.webhookResposta, 1000)
  ];

  let db;

  try {
    db = await attach();
  } catch (attachError) {
    console.error('Erro ao conectar no Firebird:', attachError.message || attachError);
    return false;
  }

  try {
    await new Promise((resolve, reject) => {
      db.query(sql, params, (queryError) => {
        if (queryError) {
          reject(queryError);
          return;
        }
        resolve();
      });
    });
    return true;
  } catch (queryError) {
    console.error('Erro ao inserir BACKUP_UPLOAD_LOG:', queryError.message || queryError);
    return false;
  } finally {
    await detach(db);
  }
};

module.exports = {
  insertBackupUploadLog
};
