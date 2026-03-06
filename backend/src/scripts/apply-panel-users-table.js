const env = require('../config/env');
const panelUserRepository = require('../repositories/panel-user.repository');
const { attach, detach } = require('../services/firebird.service');
const { hashPassword } = require('../utils/hash.utils');

const createTableIfNeeded = async (db) => {
  const existsRows = await new Promise((resolve, reject) => {
    db.query(`
      SELECT 1
      FROM RDB$RELATIONS
      WHERE RDB$RELATION_NAME = 'USUARIOS_PAINEL'
    `, [], (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });

  if (existsRows?.length) {
    console.log('Tabela USUARIOS_PAINEL ja existe.');
    return;
  }

  await new Promise((resolve, reject) => {
    db.query(`
      CREATE TABLE USUARIOS_PAINEL (
        ID BIGINT NOT NULL,
        NOME VARCHAR(120) NOT NULL,
        LOGIN VARCHAR(60) NOT NULL,
        SENHA_HASH VARCHAR(255) NOT NULL,
        ATIVO CHAR(1) DEFAULT 'S',
        CONSTRAINT PK_USUARIOS_PAINEL PRIMARY KEY (ID)
      )
    `, [], (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  console.log('Tabela USUARIOS_PAINEL criada com sucesso.');
};

const seedDefaultUser = async () => {
  const users = await panelUserRepository.listActivePanelUsers();
  if (users.length > 0) {
    console.log('Usuarios do painel ja existentes, seed ignorado.');
    return;
  }

  await panelUserRepository.upsertPanelUser({
    id: 1,
    nome: 'Herasoft',
    login: env.basicAuthUser,
    senhaHash: hashPassword(env.basicAuthPass)
  });

  console.log(`Usuario inicial criado: login "${env.basicAuthUser}".`);
};

const run = async () => {
  let db;

  try {
    db = await attach();
    await createTableIfNeeded(db);
  } catch (error) {
    console.error('Erro ao preparar USUARIOS_PAINEL:', error.message || error);
    process.exitCode = 1;
  } finally {
    if (db) {
      await detach(db);
    }
  }

  if (!process.exitCode) {
    await seedDefaultUser();
  }
};

run().catch((error) => {
  console.error('Erro no script de usuarios do painel:', error.message || error);
  process.exitCode = 1;
});
