const env = require('../config/env');

const formatDateTimePtBr = (date = new Date()) => date.toLocaleString('pt-BR', {
  timeZone: env.timezone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}).replace(/\//g, '-');

module.exports = {
  formatDateTimePtBr
};
