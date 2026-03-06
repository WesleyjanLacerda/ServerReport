# Estrutura do Projeto

## Árvore de Pastas

```text
project-root/
  .env
  .env.example
  .gitignore
  package.json
  README.md
  docs/
    estrutura-do-projeto.md
  src/
    app.js
    server.js
    config/
      env.js
      firebird.js
      paths.js
    constants/
      headers.js
    controllers/
      root.controller.js
      reports.controller.js
      update.controller.js
      upload.controller.js
    middlewares/
      auth.middleware.js
      request-logger.middleware.js
      upload.middleware.js
      error-handler.middleware.js
    routes/
      index.js
      root.routes.js
      reports.routes.js
      updates.routes.js
      upload.routes.js
    services/
      zip.service.js
      log-file.service.js
      backup-upload-log.service.js
      webhook.service.js
      firebird.service.js
    utils/
      path.utils.js
      file.utils.js
      request.utils.js
      text.utils.js
      date.utils.js
```

## Responsabilidades

- `src/config`: leitura do `.env`, diretórios e opções do Firebird.
- `src/constants`: nomes de headers preservados.
- `src/controllers`: implementação dos endpoints sem alterar URLs nem respostas.
- `src/middlewares`: autenticação Basic Auth, logs de requisição, upload com `multer` e tratamento final de erro.
- `src/routes`: definição das rotas preservadas e agregação central.
- `src/services`: zip/download, gravação de logs em arquivo, webhook Bubble e insert no Firebird.
- `src/utils`: sanitização, datas, arquivos e dados auxiliares.

## Fluxo do Upload

1. `POST /api/upload/:pasta` passa pelo Basic Auth.
2. `multer` recebe `upload.single('file')` e grava temporariamente em `BACKUP_DIR`.
3. O controller valida `:pasta`, sanitiza o nome original e resolve a pasta final.
4. A pasta de destino é criada, o arquivo é movido e a resposta de sucesso é enviada.
5. Após a resposta, o webhook Bubble é disparado.
6. O resultado do webhook é registrado na tabela `BACKUP_UPLOAD_LOG` no Firebird.

## Fluxo do Download Zip

1. O endpoint autenticado recebe `:pasta`.
2. O controller localiza a pasta base correspondente.
3. A service de zip cria `${pasta}.zip` no diretório atual.
4. O arquivo é enviado com `res.download`.
5. Ao final, o zip temporário é removido.

## Logs

- O comportamento de log de requisição foi encapsulado sem mudar o formato.
- Os dois middlewares de log atuais foram preservados.
- Os arquivos continuam sendo gravados em `LOGS_DIR`, agrupados por ano e mês.

## Firebird

- As opções ficam centralizadas em `src/config/firebird.js`.
- A conexão continua usando `node-firebird`.
- O insert da tabela `BACKUP_UPLOAD_LOG` mantém a mesma estrutura de dados.

## Autenticação

- O formato continua sendo Basic Auth.
- Usuário e senha agora são lidos de `BASIC_AUTH_USER` e `BASIC_AUTH_PASS`.
- Os endpoints protegidos continuam exigindo autenticação exatamente como antes.
