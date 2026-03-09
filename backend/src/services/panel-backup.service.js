const repository = require('../repositories/backup-log.repository');
const { truncateText } = require('../utils/text.utils');

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const buildDefaultDateRange = () => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  start.setDate(start.getDate() - 1);
  end.setDate(end.getDate() + 1);

  return {
    dataIni: formatLocalDate(start),
    dataFim: formatLocalDate(end)
  };
};

const withDefaultDateRange = (filters = {}) => {
  if (filters.dataIni || filters.dataFim) {
    return filters;
  }

  return {
    ...filters,
    ...buildDefaultDateRange()
  };
};

const listBackups = async (filters) => {
  const normalizedFilters = withDefaultDateRange(filters);
  const pagination = repository.normalizePagination(normalizedFilters);
  const [items, total] = await Promise.all([
    repository.listBackupLogs(normalizedFilters),
    repository.countBackupLogs(normalizedFilters)
  ]);

  return {
    items,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / pagination.limit)
    },
    filters: {
      dataIni: normalizedFilters.dataIni || null,
      dataFim: normalizedFilters.dataFim || null
    }
  };
};

const listCompanies = () => repository.listDistinctCompanies();

const getBackupDetails = async (id) => repository.findBackupLogById(id);

const reviewBackup = async ({ id, usuarioRevisao, obsRevisao }) => {
  const normalizedObs = truncateText(
    typeof obsRevisao === 'string' && obsRevisao.trim()
      ? obsRevisao.trim()
      : 'Revisado no painel',
    500
  );

  await repository.markBackupLogAsReviewed({
    id,
    usuarioRevisao: truncateText(usuarioRevisao, 120),
    obsRevisao: normalizedObs
  });

  return repository.findBackupLogById(id);
};

const unreviewBackup = async (id) => {
  await repository.unmarkBackupLogAsReviewed(id);
  return repository.findBackupLogById(id);
};

const getSummary = async (filters) => repository.getBackupLogSummary(withDefaultDateRange(filters));

const listWithoutRecentBackupAlerts = async () => {
  const items = await repository.listCompaniesWithoutRecentBackup();

  return {
    items,
    total: items.length
  };
};

module.exports = {
  getBackupDetails,
  getSummary,
  listBackups,
  listCompanies,
  listWithoutRecentBackupAlerts,
  reviewBackup,
  unreviewBackup
};
