const { attach, detach } = require('../services/firebird.service');

const COLUMNS = [
  { name: 'REVISADO', sql: "ALTER TABLE BACKUP_UPLOAD_LOG ADD REVISADO CHAR(1)" },
  { name: 'DATA_HORA_REVISAO', sql: 'ALTER TABLE BACKUP_UPLOAD_LOG ADD DATA_HORA_REVISAO TIMESTAMP' },
  { name: 'USUARIO_REVISAO', sql: 'ALTER TABLE BACKUP_UPLOAD_LOG ADD USUARIO_REVISAO VARCHAR(120)' },
  { name: 'OBS_REVISAO', sql: 'ALTER TABLE BACKUP_UPLOAD_LOG ADD OBS_REVISAO VARCHAR(500)' }
];

const columnExists = (db, columnName) => new Promise((resolve, reject) => {
  db.query(
    `
      SELECT 1
      FROM RDB$RELATION_FIELDS
      WHERE RDB$RELATION_NAME = 'BACKUP_UPLOAD_LOG'
        AND TRIM(RDB$FIELD_NAME) = ?
    `,
    [columnName],
    (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(Array.isArray(rows) && rows.length > 0);
    }
  );
});

const executeStatement = (db, sql) => new Promise((resolve, reject) => {
  db.query(sql, [], (error) => {
    if (error) {
      reject(error);
      return;
    }

    resolve();
  });
});

const run = async () => {
  let db;

  try {
    db = await attach();

    for (const column of COLUMNS) {
      const exists = await columnExists(db, column.name);
      if (exists) {
        console.log(`Coluna ${column.name} já existe.`);
        continue;
      }

      await executeStatement(db, column.sql);
      console.log(`Coluna ${column.name} criada com sucesso.`);
    }
  } catch (error) {
    console.error('Erro ao aplicar alteração da BACKUP_UPLOAD_LOG:', error.message || error);
    process.exitCode = 1;
  } finally {
    if (db) {
      await detach(db);
    }
  }
};

run();
