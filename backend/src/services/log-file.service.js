const fs = require('fs');
const path = require('path');
const { LOGS_DIR } = require('../config/paths');

const writeLog = (logMessage, headers) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const logFileName = `${year}-${month}.txt`;
  const logFilePath = path.join(LOGS_DIR, logFileName);

  let formattedLogMessage = `[${currentDate.toLocaleString()}] ${logMessage}`;
  if (headers) {
    formattedLogMessage += ` - Headers: ${JSON.stringify(headers)}`;
  }
  formattedLogMessage += '\n';

  fs.appendFile(logFilePath, formattedLogMessage, (err) => {
    if (err) {
      console.error('Erro ao escrever no arquivo de log:', err);
    }
  });
};

module.exports = {
  writeLog
};
