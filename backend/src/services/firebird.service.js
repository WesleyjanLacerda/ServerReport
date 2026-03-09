const firebird = require('node-firebird');
const { FIREBIRD_OPTIONS } = require('../config/firebird');

const attach = () => new Promise((resolve, reject) => {
  firebird.attach(FIREBIRD_OPTIONS, (error, db) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(db);
  });
});

const detach = (db) => new Promise((resolve) => {
  db.detach((error) => {
    if (error) {
      console.error('Erro ao finalizar conexao Firebird:', error.message || error);
    }
    resolve();
  });
});

const query = async (sql, params) => {
  const db = await attach();

  try {
    const rows = await new Promise((resolve, reject) => {
      db.query(sql, params, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
    return rows;
  } finally {
    await detach(db);
  }
};

const execute = async (sql, params) => {
  await query(sql, params);
  return true;
};

const withTransaction = async (handler) => {
  const db = await attach();

  try {
    const transaction = await new Promise((resolve, reject) => {
      db.transaction(firebird.ISOLATION_READ_COMMITTED, (error, tx) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(tx);
      });
    });

    try {
      const result = await handler(transaction);

      await new Promise((resolve, reject) => {
        transaction.commit((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      return result;
    } catch (error) {
      await new Promise((resolve) => {
        transaction.rollback(() => resolve());
      });
      throw error;
    }
  } finally {
    await detach(db);
  }
};

module.exports = {
  attach,
  detach,
  query,
  execute,
  withTransaction
};
