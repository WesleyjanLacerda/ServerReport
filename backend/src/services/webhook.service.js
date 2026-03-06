const axios = require('axios');
const env = require('../config/env');

const postBackupLog = (data) => axios.post(env.webhookUrl, data);

module.exports = {
  postBackupLog
};
