const { attach, detach } = require('../services/firebird.service');

const executeStatement = (db, sql) => new Promise((resolve, reject) => {
  db.query(sql, [], (error) => {
    if (error) {
      reject(error);
      return;
    }

    resolve();
  });
});

const tableExists = (db, tableName) => new Promise((resolve, reject) => {
  db.query(
    `
      SELECT 1
      FROM RDB$RELATIONS
      WHERE RDB$RELATION_NAME = ?
    `,
    [tableName],
    (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(Array.isArray(rows) && rows.length > 0);
    }
  );
});

const indexExists = (db, indexName) => new Promise((resolve, reject) => {
  db.query(
    `
      SELECT 1
      FROM RDB$INDICES
      WHERE RDB$INDEX_NAME = ?
    `,
    [indexName],
    (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(Array.isArray(rows) && rows.length > 0);
    }
  );
});

const queryRows = (db, sql, params) => new Promise((resolve, reject) => {
  db.query(sql, params, (error, rows) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(rows || []);
  });
});

const createTableIfNeeded = async (db) => {
  const exists = await tableExists(db, 'EMPRESAS_BACKUP_MONITORADAS');
  if (!exists) {
    await executeStatement(db, `
      CREATE TABLE EMPRESAS_BACKUP_MONITORADAS (
        ID BIGINT NOT NULL,
        EMPRESA VARCHAR(120) NOT NULL,
        ATIVO CHAR(1) DEFAULT 'S',
        OBRIGA_BACKUP CHAR(1) DEFAULT 'S',
        HORAS_LIMITE_SEM_BACKUP INTEGER DEFAULT 24,
        EXIBIR_ALERTA CHAR(1) DEFAULT 'S',
        OBSERVACAO VARCHAR(500),
        DATA_CADASTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT PK_EMPRESAS_BACKUP_MONITORADAS PRIMARY KEY (ID)
      )
    `);
    console.log('Tabela EMPRESAS_BACKUP_MONITORADAS criada com sucesso.');
  } else {
    console.log('Tabela EMPRESAS_BACKUP_MONITORADAS ja existe.');
  }

  const uniqueIndexExists = await indexExists(db, 'UX_EMP_BACKUP_MON_EMPRESA');
  if (!uniqueIndexExists) {
    await executeStatement(
      db,
      'CREATE UNIQUE INDEX UX_EMP_BACKUP_MON_EMPRESA ON EMPRESAS_BACKUP_MONITORADAS (EMPRESA)'
    );
    console.log('Indice unico UX_EMP_BACKUP_MON_EMPRESA criado com sucesso.');
  } else {
    console.log('Indice unico UX_EMP_BACKUP_MON_EMPRESA ja existe.');
  }
};

const seedCompanies = async (db) => {
  const existingRows = await queryRows(
    db,
    'SELECT COALESCE(MAX(ID), 0) AS MAX_ID FROM EMPRESAS_BACKUP_MONITORADAS',
    []
  );
  let nextId = Number(existingRows?.[0]?.MAX_ID || 0);

  const companies = await queryRows(
    db,
    `
      SELECT DISTINCT TRIM(log.EMPRESA) AS EMPRESA
      FROM BACKUP_UPLOAD_LOG log
      WHERE log.EMPRESA IS NOT NULL
        AND TRIM(log.EMPRESA) <> ''
        AND NOT EXISTS (
          SELECT 1
          FROM EMPRESAS_BACKUP_MONITORADAS monitoradas
          WHERE monitoradas.EMPRESA = TRIM(log.EMPRESA)
        )
      ORDER BY 1
    `,
    []
  );

  if (companies.length === 0) {
    console.log('Nenhuma empresa nova para popular em EMPRESAS_BACKUP_MONITORADAS.');
    return;
  }

  for (const company of companies) {
    nextId += 1;
    await executeStatement(
      db,
      `
        INSERT INTO EMPRESAS_BACKUP_MONITORADAS (
          ID,
          EMPRESA,
          ATIVO,
          OBRIGA_BACKUP,
          HORAS_LIMITE_SEM_BACKUP,
          EXIBIR_ALERTA
        ) VALUES (
          ${nextId},
          '${String(company.EMPRESA).replace(/'/g, "''")}',
          'S',
          'S',
          24,
          'S'
        )
      `
    );
  }

  console.log(`${companies.length} empresa(s) adicionada(s) ao monitoramento de backup.`);
};

const run = async () => {
  let db;

  try {
    db = await attach();
    await createTableIfNeeded(db);
    await seedCompanies(db);
  } catch (error) {
    console.error('Erro ao preparar EMPRESAS_BACKUP_MONITORADAS:', error.message || error);
    process.exitCode = 1;
  } finally {
    if (db) {
      await detach(db);
    }
  }
};

run();
