const express = require('express');
const path = require('path');
const fs = require('fs');
const basicAuth = require('basic-auth');
const app = express();
const archiver = require('archiver');

const PORT = process.env.PORT || 3000;
const REPORTS_DIR = path.join(__dirname, 'reports');

const auth = (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== 'admin' || user.pass !== 'admin') {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
    return;
  }
  next();
};

app.use('/reports', auth, express.static(REPORTS_DIR));

app.get('/', (req, res) => {
  res.send('Servidor de Relatórios');
});

app.get('/api/reports', auth, (req, res) => {
    const options = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const dateTime = new Date().toLocaleString('pt-BR', options).replace(/\//g, '-');
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log(`[${dateTime}] Requisição para baixar todos os relatórios recebida do IP ${ip}.`);
      
  
  fs.readdir(REPORTS_DIR, (err, files) => {
    if (err) {
      return res.status(500).send('Não foi possível listar os arquivos.');
    }
    res.json(files);
  });
});

app.get('/api/atualizartodos', auth, (req, res) => {    
  const options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const dateTime = new Date().toLocaleString('pt-BR', options).replace(/\//g, '-');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`[${dateTime}] Requisição para baixar todos os relatórios recebida do IP ${ip}.`);

  const zipFileName = 'relatorios.zip';
  const output = fs.createWriteStream(zipFileName);
  const archive = archiver('zip', {
    zlib: { level: 9 } // nível de compressão máximo
  });

  output.on('error', err => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(output);
  archive.directory(REPORTS_DIR, false);
  archive.finalize();

  output.on('close', () => {
    res.download(zipFileName, zipFileName, (err) => {
      if (err) {
        console.error('Erro ao enviar o arquivo zip:', err);
      }
      fs.unlink(zipFileName, (err) => {
        if (err) {
          console.error('Erro ao excluir o arquivo zip:', err);
        }
      });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
