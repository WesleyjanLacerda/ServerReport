const fs = require('fs');
const multer = require('multer');
const { BACKUP_DIR } = require('../config/paths');
const { sanitizeFilename, sanitizePathSegment, resolvePathInsideBase } = require('../utils/path.utils');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pasta = sanitizePathSegment(req.params.pasta);
    if (!pasta) {
      cb(null, BACKUP_DIR);
      return;
    }

    const destinationPath = resolvePathInsideBase(BACKUP_DIR, pasta);
    if (!destinationPath) {
      cb(null, BACKUP_DIR);
      return;
    }

    fs.mkdir(destinationPath, { recursive: true }, (error) => {
      if (error) {
        cb(error);
        return;
      }

      cb(null, destinationPath);
    });
  },
  filename: (req, file, cb) => {
    const safeName = sanitizeFilename(file.originalname);
    if (!safeName) {
      cb(new Error('Nome de arquivo inválido.'));
      return;
    }
    cb(null, safeName);
  }
});

module.exports = multer({ storage });
