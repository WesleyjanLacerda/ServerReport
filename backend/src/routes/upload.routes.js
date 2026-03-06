const express = require('express');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { uploadBackup } = require('../controllers/upload.controller');

const router = express.Router();

router.post('/api/upload/:pasta', auth, upload.single('file'), uploadBackup);

module.exports = router;
