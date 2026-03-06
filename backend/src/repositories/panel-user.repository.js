const { query, execute } = require('../services/firebird.service');

const normalizeUser = (row) => ({
  id: row.ID,
  nome: row.NOME,
  login: row.LOGIN,
  ativo: String(row.ATIVO || 'S').trim() === 'S'
});

const listActivePanelUsers = async () => {
  const sql = `
    SELECT ID, NOME, LOGIN, ATIVO
    FROM USUARIOS_PAINEL
    WHERE TRIM(COALESCE(ATIVO, 'S')) = 'S'
    ORDER BY NOME
  `;

  const rows = await query(sql, []);
  return rows.map(normalizeUser);
};

const findPanelUserByLogin = async (login) => {
  const sql = `
    SELECT ID, NOME, LOGIN, SENHA_HASH, ATIVO
    FROM USUARIOS_PAINEL
    WHERE LOGIN = ?
  `;

  const rows = await query(sql, [login]);
  if (!rows?.length) {
    return null;
  }

  const row = rows[0];
  return {
    ...normalizeUser(row),
    senhaHash: row.SENHA_HASH
  };
};

const upsertPanelUser = async ({ id, nome, login, senhaHash }) => {
  const existsRows = await query('SELECT ID FROM USUARIOS_PAINEL WHERE ID = ?', [id]);

  if (existsRows?.length) {
    await execute(`
      UPDATE USUARIOS_PAINEL
      SET NOME = ?, LOGIN = ?, SENHA_HASH = ?, ATIVO = 'S'
      WHERE ID = ?
    `, [nome, login, senhaHash, id]);
    return true;
  }

  await execute(`
    INSERT INTO USUARIOS_PAINEL (ID, NOME, LOGIN, SENHA_HASH, ATIVO)
    VALUES (?, ?, ?, ?, 'S')
  `, [id, nome, login, senhaHash]);
  return true;
};

module.exports = {
  findPanelUserByLogin,
  listActivePanelUsers,
  upsertPanelUser
};
