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
    await new Promise((resolve, reject) => {
      db.query(sql, params, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    return true;
  } finally {
    await detach(db);
  }
};

module.exports = {
  attach,
  detach,
  query
};
