const express = require('express');
const {
  getBackupDetails,
  getSummary,
  listBackups,
  listCompanies,
  listWithoutRecentBackupAlerts,
  reviewBackup,
  unreviewBackup
} = require('../controllers/panel-backup.controller');
const {
  listUsers,
  login
} = require('../controllers/panel-auth.controller');

const router = express.Router();

router.get('/api/painel/usuarios', listUsers);
router.post('/api/painel/login', login);
router.get('/api/painel/backups/resumo', getSummary);
router.get('/api/painel/backups/empresas', listCompanies);
router.get('/api/painel/backups/alertas/sem-backup', listWithoutRecentBackupAlerts);
router.get('/api/painel/backups/:id', getBackupDetails);
router.get('/api/painel/backups', listBackups);
router.put('/api/painel/backups/:id/revisar', reviewBackup);
router.put('/api/painel/backups/:id/desrevisar', unreviewBackup);

module.exports = router;
