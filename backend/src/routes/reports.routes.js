const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { listReports } = require('../controllers/reports.controller');

const router = express.Router();

router.get('/api/reports', auth, listReports);

module.exports = router;
