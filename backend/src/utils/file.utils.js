const fs = require('fs');

const ensureDirectory = (directoryPath, callback) => {
  fs.mkdir(directoryPath, { recursive: true }, callback);
};

module.exports = {
  ensureDirectory
};
