const panelBackupService = require('../services/panel-backup.service');

const parseId = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

const listBackups = async (req, res, next) => {
  try {
    const result = await panelBackupService.listBackups(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const listCompanies = async (req, res, next) => {
  try {
    const empresas = await panelBackupService.listCompanies();
    res.json({ items: empresas });
  } catch (error) {
    next(error);
  }
};

const getBackupDetails = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID inválido.' });
      return;
    }

    const item = await panelBackupService.getBackupDetails(id);
    if (!item) {
      res.status(404).json({ error: 'Log não encontrado.' });
      return;
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

const reviewBackup = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID inválido.' });
      return;
    }

    const item = await panelBackupService.reviewBackup({
      id,
      usuarioRevisao: req.body?.usuarioRevisao,
      obsRevisao: req.body?.obsRevisao
    });

    if (!item) {
      res.status(404).json({ error: 'Log não encontrado.' });
      return;
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
};

const unreviewBackup = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID inválido.' });
      return;
    }

    const item = await panelBackupService.unreviewBackup(id);
    if (!item) {
      res.status(404).json({ error: 'Log não encontrado.' });
      return;
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const summary = await panelBackupService.getSummary(req.query);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

const listWithoutRecentBackupAlerts = async (req, res, next) => {
  try {
    const result = await panelBackupService.listWithoutRecentBackupAlerts();
    res.json(result);
  } catch (error) {
    next(error);
  }
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
