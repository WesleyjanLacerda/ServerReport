const express = require('express');
const { getRoot } = require('../controllers/root.controller');

const router = express.Router();

router.get('/', getRoot);

module.exports = router;
