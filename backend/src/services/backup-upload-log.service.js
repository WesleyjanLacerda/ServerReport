const { withTransaction } = require('./firebird.service');
const { truncateText } = require('../utils/text.utils');

const insertBackupUploadLog = async (record) => {
  const normalizedParams = [
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

  const selectExistingSql = `
    SELECT FIRST 1 ID
    FROM BACKUP_UPLOAD_LOG
    WHERE CAMINHO_ARQUIVO = ?
    ORDER BY ID DESC
  `;

  const updateSql = `
    UPDATE BACKUP_UPLOAD_LOG
    SET
      EMPRESA = ?,
      USUARIO = ?,
      IP_ORIGEM = ?,
      HOST_ORIGEM = ?,
      CAMINHO_ARQUIVO = ?,
      NOME_ARQUIVO = ?,
      TAMANHO_BYTES = ?,
      DATA_HORA_UPLOAD = ?,
      STATUS = ?,
      MENSAGEM_ERRO = ?,
      WEBHOOK_STATUS = ?,
      WEBHOOK_RESPOSTA = ?
    WHERE ID = ?
  `;

  const insertSql = `
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

  try {
    await withTransaction(async (transaction) => {
      const existingRows = await new Promise((resolve, reject) => {
        transaction.query(selectExistingSql, [normalizedParams[4]], (queryError, result) => {
          if (queryError) {
            reject(queryError);
            return;
          }

          resolve(result || []);
        });
      });

      if (existingRows.length > 0) {
        await new Promise((resolve, reject) => {
          transaction.query(updateSql, [...normalizedParams, existingRows[0].ID], (queryError) => {
            if (queryError) {
              reject(queryError);
              return;
            }
            resolve();
          });
        });
        return;
      }

      await new Promise((resolve, reject) => {
        transaction.query(insertSql, normalizedParams, (queryError) => {
          if (queryError) {
            reject(queryError);
            return;
          }
          resolve();
        });
      });
    });

    return true;
  } catch (queryError) {
    console.error('Erro ao inserir BACKUP_UPLOAD_LOG:', queryError.message || queryError);
    return false;
  }
};

module.exports = {
  insertBackupUploadLog
};
