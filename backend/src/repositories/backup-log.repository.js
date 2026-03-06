const { query, execute } = require('../services/firebird.service');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const coercePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const normalizePagination = ({ page, limit }) => {
  const safeLimit = Math.min(coercePositiveInteger(limit, DEFAULT_LIMIT), MAX_LIMIT);
  const safePage = coercePositiveInteger(page, 1);

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit
  };
};

const buildDateStart = (value) => {
  if (!value) return null;
  return `${String(value).trim()} 00:00:00`;
};

const buildDateEnd = (value) => {
  if (!value) return null;
  return `${String(value).trim()} 23:59:59`;
};

const buildFilters = (filters = {}) => {
  const clauses = [];
  const params = [];

  if (filters.empresa) {
    clauses.push('EMPRESA = ?');
    params.push(filters.empresa);
  }

  if (filters.status) {
    clauses.push('STATUS = ?');
    params.push(filters.status);
  }

  if (filters.webhookStatus) {
    clauses.push('WEBHOOK_STATUS = ?');
    params.push(filters.webhookStatus);
  }

  if (filters.revisado === 'S') {
    clauses.push("COALESCE(REVISADO, 'N') = 'S'");
  }

  if (filters.revisado === 'N') {
    clauses.push("COALESCE(REVISADO, 'N') <> 'S'");
  }

  if (filters.dataIni) {
    clauses.push('DATA_HORA_UPLOAD >= ?');
    params.push(buildDateStart(filters.dataIni));
  }

  if (filters.dataFim) {
    clauses.push('DATA_HORA_UPLOAD <= ?');
    params.push(buildDateEnd(filters.dataFim));
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params
  };
};

const trimNullableString = (value) => {
  if (value == null) {
    return null;
  }

  return String(value).trim();
};

const normalizeRow = (row) => ({
  id: row.ID,
  empresa: row.EMPRESA,
  usuario: row.USUARIO,
  ipOrigem: row.IP_ORIGEM,
  hostOrigem: row.HOST_ORIGEM,
  caminhoArquivo: row.CAMINHO_ARQUIVO,
  nomeArquivo: row.NOME_ARQUIVO,
  tamanhoBytes: row.TAMANHO_BYTES,
  dataHoraUpload: row.DATA_HORA_UPLOAD,
  status: row.STATUS,
  mensagemErro: row.MENSAGEM_ERRO,
  webhookStatus: row.WEBHOOK_STATUS,
  webhookResposta: row.WEBHOOK_RESPOSTA,
  revisado: trimNullableString(row.REVISADO) === 'S',
  dataHoraRevisao: row.DATA_HORA_REVISAO,
  usuarioRevisao: row.USUARIO_REVISAO,
  obsRevisao: row.OBS_REVISAO
});

const listBackupLogs = async (filters) => {
  const pagination = normalizePagination(filters);
  const { whereSql, params } = buildFilters(filters);
  const sql = `
    SELECT FIRST ${pagination.limit} SKIP ${pagination.offset}
      ID,
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
      WEBHOOK_RESPOSTA,
      REVISADO,
      DATA_HORA_REVISAO,
      USUARIO_REVISAO,
      OBS_REVISAO
    FROM BACKUP_UPLOAD_LOG
    ${whereSql}
    ORDER BY DATA_HORA_UPLOAD DESC, ID DESC
  `;

  const rows = await query(sql, params);
  return rows.map(normalizeRow);
};

const countBackupLogs = async (filters) => {
  const { whereSql, params } = buildFilters(filters);
  const sql = `
    SELECT COUNT(*) AS TOTAL
    FROM BACKUP_UPLOAD_LOG
    ${whereSql}
  `;

  const rows = await query(sql, params);
  return Number(rows?.[0]?.TOTAL || 0);
};

const listDistinctCompanies = async () => {
  const sql = `
    SELECT DISTINCT EMPRESA
    FROM BACKUP_UPLOAD_LOG
    WHERE EMPRESA IS NOT NULL
    ORDER BY EMPRESA
  `;

  const rows = await query(sql, []);
  return rows.map((row) => row.EMPRESA).filter(Boolean);
};

const findBackupLogById = async (id) => {
  const sql = `
    SELECT
      ID,
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
      WEBHOOK_RESPOSTA,
      REVISADO,
      DATA_HORA_REVISAO,
      USUARIO_REVISAO,
      OBS_REVISAO
    FROM BACKUP_UPLOAD_LOG
    WHERE ID = ?
  `;

  const rows = await query(sql, [id]);
  if (!rows || rows.length === 0) {
    return null;
  }

  return normalizeRow(rows[0]);
};

const markBackupLogAsReviewed = async ({ id, usuarioRevisao, obsRevisao }) => {
  const sql = `
    UPDATE BACKUP_UPLOAD_LOG
    SET
      REVISADO = 'S',
      DATA_HORA_REVISAO = CURRENT_TIMESTAMP,
      USUARIO_REVISAO = ?,
      OBS_REVISAO = ?
    WHERE ID = ?
  `;

  return execute(sql, [usuarioRevisao || null, obsRevisao || null, id]);
};

const unmarkBackupLogAsReviewed = async (id) => {
  const sql = `
    UPDATE BACKUP_UPLOAD_LOG
    SET
      REVISADO = NULL,
      DATA_HORA_REVISAO = NULL,
      USUARIO_REVISAO = NULL,
      OBS_REVISAO = NULL
    WHERE ID = ?
  `;

  return execute(sql, [id]);
};

const getBackupLogSummary = async (filters) => {
  const { whereSql, params } = buildFilters(filters);
  const sql = `
    SELECT
      COUNT(*) AS TOTAL,
      SUM(CASE WHEN STATUS = 'SUCESSO' THEN 1 ELSE 0 END) AS SUCESSO,
      SUM(CASE WHEN STATUS = 'ERRO' THEN 1 ELSE 0 END) AS ERRO,
      SUM(CASE WHEN WEBHOOK_STATUS = 'FALHOU' THEN 1 ELSE 0 END) AS WEBHOOK_FALHOU,
      SUM(CASE WHEN COALESCE(REVISADO, 'N') <> 'S' THEN 1 ELSE 0 END) AS PENDENTES_REVISAO
    FROM BACKUP_UPLOAD_LOG
    ${whereSql}
  `;

  const rows = await query(sql, params);
  const row = rows?.[0] || {};

  return {
    total: Number(row.TOTAL || 0),
    sucesso: Number(row.SUCESSO || 0),
    erro: Number(row.ERRO || 0),
    webhookFalhou: Number(row.WEBHOOK_FALHOU || 0),
    pendentesRevisao: Number(row.PENDENTES_REVISAO || 0)
  };
};

module.exports = {
  countBackupLogs,
  findBackupLogById,
  getBackupLogSummary,
  listBackupLogs,
  listDistinctCompanies,
  markBackupLogAsReviewed,
  normalizePagination,
  unmarkBackupLogAsReviewed
};
