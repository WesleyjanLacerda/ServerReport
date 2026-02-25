const express = require('express');
const path = require('path');
const fs = require('fs');
const basicAuth = require('basic-auth');
const multer = require('multer');
const app = express();
const archiver = require('archiver');
const axios = require('axios');

const PORT = process.env.PORT || 15099;
const REPORTS_DIR = 'D:\\Scripts\\Reports';
const REPORTS_DIR2 = 'D:\\Update\\HeraLav';
const REPORTS_DIR3 = 'D:\\Update\\HeraERP';
const REPORTS_DIR4 = 'D:\\Update\\Commerce';
const LOGS_DIR = 'C:\\HeraSis\\ServerReport\\logs';//path.join(__dirname, 'logs');
const BACKUP = 'D:\\BACKUP';

// Configuração do multer para armazenar os arquivos enviados
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, BACKUP);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Função para escrever logs em arquivos
const writeLog = (logMessage, headers) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda se for necessário
  const logFileName = `${year}-${month}.txt`;
  const logFilePath = path.join(LOGS_DIR, logFileName);

  // Formata a mensagem de log com os headers, se fornecidos
  let formattedLogMessage = `[${currentDate.toLocaleString()}] ${logMessage}`;
  if (headers) {
    formattedLogMessage += ` - Headers: ${JSON.stringify(headers)}`;
  }
  formattedLogMessage += '\n';

  // Adiciona a mensagem de log ao arquivo
  fs.appendFile(logFilePath, formattedLogMessage, (err) => {
    if (err) {
      console.error('Erro ao escrever no arquivo de log:', err);
    }
  });
};

// Middleware para escrever logs para cada requisição
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const logMessage = `Requisição para ${req.method} ${req.originalUrl} - IP: ${ip}`;
  const headers = {
    empresa: req.headers['empresa'],
    usuario: req.headers['usuario']
  };
  writeLog(logMessage, headers);
  next();
});

// Middleware de autenticação
const auth = (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== 'herasoft' || user.pass !== '451263') {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
    return;
  }
  next();
};

// Middleware para escrever logs para cada requisição
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const logMessage = `Requisição para ${req.method} ${req.originalUrl} - IP: ${ip}`;
  writeLog(logMessage);
  next();
});

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
  console.log(`[${dateTime}] Requisição de consulta ${ip}.`);


  fs.readdir(REPORTS_DIR, (err, files) => {
    if (err) {
      return res.status(500).send('Não foi possível listar os arquivos.');
    }
    res.json(files);
  });
});

app.get('/api/atualizartodos/:pasta', auth, (req, res) => {
  const pasta = req.params.pasta;
  const empresa = req.headers['empresa'];
  const usuario = req.headers['usuario'];

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
  console.log(`[${dateTime}][${empresa}-${usuario}][${pasta}] Requisição para baixar todos os relatórios ${ip}.`);

  const pastaPath = path.join(REPORTS_DIR, pasta);

  // Verifica se a pasta existe
  fs.access(pastaPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send(`Pasta '${pasta}' não encontrada.`);
    }

    // Cria o nome do arquivo zip
    const zipFileName = `${pasta}.zip`;

    // Cria um fluxo de escrita para o arquivo zip
    const output = fs.createWriteStream(zipFileName);
    const archive = archiver('zip', {
      zlib: { level: 9 } // nível de compressão máximo
    });

    output.on('error', err => {
      res.status(500).send({ error: err.message });
    });

    // Define a pasta a ser compactada
    archive.directory(pastaPath, false);

    // Faz a compactação final e envia o arquivo zip para o cliente
    archive.pipe(output);
    archive.finalize();

    output.on('close', () => {
      res.download(zipFileName, zipFileName, (err) => {
        if (err) {
          console.error('Erro ao enviar o arquivo zip:', err);
        }
        // Após o download, exclui o arquivo zip
        fs.unlink(zipFileName, (err) => {
          if (err) {
            console.error('Erro ao excluir o arquivo zip:', err);
          }
        });
      });
    });
  });
});

app.get('/api/atualizaexeheralav/:pasta', auth, (req, res) => {
  const pasta = req.params.pasta;
  const empresa = req.headers['empresa'];
  const usuario = req.headers['usuario'];

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
  console.log(`[${dateTime}][${empresa}-${usuario}] Requisição para baixar .exe v.${pasta} - ${ip}.`);

  const pastaPath = path.join(REPORTS_DIR2, pasta);

  // Verifica se a pasta existe
  fs.access(pastaPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send(`Pasta '${pasta}' não encontrada.`);
    }

    // Cria o nome do arquivo zip
    const zipFileName = `${pasta}.zip`;

    // Cria um fluxo de escrita para o arquivo zip
    const output = fs.createWriteStream(zipFileName);
    const archive = archiver('zip', {
      zlib: { level: 9 } // nível de compressão máximo
    });

    output.on('error', err => {
      res.status(500).send({ error: err.message });
    });

    // Define a pasta a ser compactada
    archive.directory(pastaPath, false);

    // Faz a compactação final e envia o arquivo zip para o cliente
    archive.pipe(output);
    archive.finalize();

    output.on('close', () => {
      res.download(zipFileName, zipFileName, (err) => {
        if (err) {
          console.error('Erro ao enviar o arquivo zip:', err);
        }
        // Após o download, exclui o arquivo zip
        fs.unlink(zipFileName, (err) => {
          if (err) {
            console.error('Erro ao excluir o arquivo zip:', err);
          }
        });
      });
    });
  });
});

app.get('/api/atualizaexeheraerp/:pasta', auth, (req, res) => {
  const pasta = req.params.pasta;
  const empresa = req.headers['empresa'];
  const usuario = req.headers['usuario'];

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
  console.log(`[${dateTime}][${empresa}-${usuario}] Requisição para baixar .exe v.${pasta} - ${ip}.`);

  const pastaPath = path.join(REPORTS_DIR3, pasta);

  // Verifica se a pasta existe
  fs.access(pastaPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send(`Pasta '${pasta}' não encontrada.`);
    }

    const zipFileName = `${pasta}.zip`;

    const output = fs.createWriteStream(zipFileName);
    const archive = archiver('zip', {
      zlib: { level: 9 } // nível de compressão máximo
    });

    output.on('error', err => {
      res.status(500).send({ error: err.message });
    });

    archive.directory(pastaPath, false);

    archive.pipe(output);
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
});

app.get('/api/atualizaexecommerce/:pasta', auth, (req, res) => {
  const pasta = req.params.pasta;
  const empresa = req.headers['empresa'];
  const usuario = req.headers['usuario'];

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
  console.log(`[${dateTime}][${empresa}-${usuario}] Requisição para baixar .exe v.${pasta} - ${ip}.`);

  const pastaPath = path.join(REPORTS_DIR4, pasta);

  // Verifica se a pasta existe
  fs.access(pastaPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send(`Pasta '${pasta}' não encontrada.`);
    }

    const zipFileName = `${pasta}.zip`;

    const output = fs.createWriteStream(zipFileName);
    const archive = archiver('zip', {
      zlib: { level: 9 } // nível de compressão máximo
    });

    output.on('error', err => {
      res.status(500).send({ error: err.message });
    });

    archive.directory(pastaPath, false);

    archive.pipe(output);
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
});


app.post('/api/upload/:pasta', auth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  const pasta = req.params.pasta;
  const empresa = req.headers['empresa'];
  const usuario = req.headers['usuario'];

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
  console.log(`[${dateTime}][${empresa}-${usuario}][${pasta}] Backup de arquivo realizado ${ip}.`);

  const backupPath = path.join(BACKUP, pasta);

  fs.mkdir(backupPath, { recursive: true }, (err) => {
    if (err) {
      return res.status(500).send('Erro ao criar pasta de backup.');
    }

    const filePath = path.join(backupPath, req.file.originalname);

    fs.rename(req.file.path, filePath, (err) => {
      if (err) {
        return res.status(500).send('Erro ao mover arquivo para a pasta de backup.');
      }
      res.status(200).send('Arquivo enviado e salvo com sucesso.');

      const data = {
        empresaPasta: pasta,
        filePasta: filePath
      };
      
      // URL do seu webhook
      const webhookUrl = 'https://heradash.bubbleapps.io/api/1.1/wf/backup_logs/';
      
      // Enviando os dados via POST
      axios.post(webhookUrl, data)
        .then(response => {
          console.log(`[${dateTime}][${empresa}-${usuario}][${pasta}] Bubble ${response.data}.`);
        })
        .catch(error => {
          console.log(`[${dateTime}][${empresa}-${usuario}][${pasta}] Bubble ${error}.`);
        });


    });
  });
});


fs.mkdir(LOGS_DIR, { recursive: true }, (err) => {
  if (err) {
    console.error('Erro ao criar a pasta de logs:', err);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});