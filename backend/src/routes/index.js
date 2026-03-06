const express = require('express');
const rootRoutes = require('./root.routes');
const reportsRoutes = require('./reports.routes');
const updatesRoutes = require('./updates.routes');
const uploadRoutes = require('./upload.routes');
const panelBackupsRoutes = require('./panel-backups.routes');

const router = express.Router();

router.use(rootRoutes);
router.use(reportsRoutes);
router.use(updatesRoutes);
router.use(uploadRoutes);
router.use(panelBackupsRoutes);

module.exports = router;
