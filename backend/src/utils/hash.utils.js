const crypto = require('crypto');

const hashPassword = (value) => crypto
  .createHash('sha256')
  .update(String(value || ''))
  .digest('hex');

module.exports = {
  hashPassword
};
