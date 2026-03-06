const fs = require('fs');
const archiver = require('archiver');

const sendZippedDirectory = (res, sourceDir, zipFileName) => {
  const output = fs.createWriteStream(zipFileName);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('error', (error) => {
    res.status(500).send({ error: error.message });
  });

  archive.directory(sourceDir, false);
  archive.pipe(output);
  archive.finalize();

  output.on('close', () => {
    res.download(zipFileName, zipFileName, (error) => {
      if (error) {
        console.error('Erro ao enviar o arquivo zip:', error);
      }

      fs.unlink(zipFileName, (unlinkError) => {
        if (unlinkError) {
          console.error('Erro ao excluir o arquivo zip:', unlinkError);
        }
      });
    });
  });
};

module.exports = {
  sendZippedDirectory
};
