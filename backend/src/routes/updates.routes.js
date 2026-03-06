const express = require('express');
const auth = require('../middlewares/auth.middleware');
const {
  downloadAllReports,
  downloadHeraLavUpdate,
  downloadHeraErpUpdate,
  downloadCommerceUpdate
} = require('../controllers/update.controller');

const router = express.Router();

router.get('/api/atualizartodos/:pasta', auth, downloadAllReports);
router.get('/api/atualizaexeheralav/:pasta', auth, downloadHeraLavUpdate);
router.get('/api/atualizaexeheraerp/:pasta', auth, downloadHeraErpUpdate);
router.get('/api/atualizaexecommerce/:pasta', auth, downloadCommerceUpdate);

module.exports = router;
