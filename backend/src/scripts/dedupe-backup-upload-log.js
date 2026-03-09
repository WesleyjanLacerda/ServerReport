const { withTransaction } = require('../services/firebird.service');

const DUPLICATES_SQL = `
  SELECT CAMINHO_ARQUIVO, COUNT(*) AS TOTAL
  FROM BACKUP_UPLOAD_LOG
  WHERE CAMINHO_ARQUIVO IS NOT NULL
  GROUP BY CAMINHO_ARQUIVO
  HAVING COUNT(*) > 1
`;

const RECORDS_SQL = `
  SELECT
    ID,
    CAMINHO_ARQUIVO,
    REVISADO,
    DATA_HORA_REVISAO,
    USUARIO_REVISAO,
    OBS_REVISAO
  FROM BACKUP_UPLOAD_LOG
  WHERE CAMINHO_ARQUIVO = ?
  ORDER BY
    CASE WHEN TRIM(COALESCE(REVISADO, 'N')) = 'S' THEN 0 ELSE 1 END,
    ID DESC
`;

const DELETE_SQL = 'DELETE FROM BACKUP_UPLOAD_LOG WHERE ID = ?';

const trimValue = (value) => (value == null ? '' : String(value).trim());

const chooseKeeper = (rows) => rows[0];

const run = async () => {
  try {
    await withTransaction(async (transaction) => {
      const duplicateGroups = await new Promise((resolve, reject) => {
        transaction.query(DUPLICATES_SQL, [], (error, rows) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(rows || []);
        });
      });

      let deletedCount = 0;

      for (const group of duplicateGroups) {
        const records = await new Promise((resolve, reject) => {
          transaction.query(RECORDS_SQL, [group.CAMINHO_ARQUIVO], (error, rows) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(rows || []);
          });
        });

        if (records.length <= 1) {
          continue;
        }

        const keeper = chooseKeeper(records);
        const toDelete = records.filter((row) => row.ID !== keeper.ID);

        for (const row of toDelete) {
          await new Promise((resolve, reject) => {
            transaction.query(DELETE_SQL, [row.ID], (error) => {
              if (error) {
                reject(error);
                return;
              }

              resolve();
            });
          });
          deletedCount += 1;
        }

        console.log(`Mantido ID ${keeper.ID} para ${trimValue(group.CAMINHO_ARQUIVO)} e removidos ${toDelete.length} duplicados.`);
      }

      console.log(`Deduplicacao concluida. Registros removidos: ${deletedCount}.`);
    });
  } catch (error) {
    console.error('Erro ao deduplicar BACKUP_UPLOAD_LOG:', error.message || error);
    process.exitCode = 1;
  }
};

run();
