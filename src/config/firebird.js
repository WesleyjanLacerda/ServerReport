const env = require('./env');

const FIREBIRD_OPTIONS = {
  host: env.firebird.host,
  port: env.firebird.port,
  database: env.firebird.database,
  user: env.firebird.user,
  password: env.firebird.password,
  lowercase_keys: false,
  role: env.firebird.role,
  pageSize: env.firebird.pageSize
};

module.exports = {
  FIREBIRD_OPTIONS
};
