# ServerReport

API Node.js/Express para listar relatórios, disponibilizar downloads compactados e receber uploads de backup, preservando autenticação Basic Auth, integração com Firebird e webhook Bubble.

## Instalação

```bash
npm install
```

## Configuração

1. Crie ou ajuste o arquivo `.env` com base em `.env.example`.
2. Configure diretórios, credenciais Basic Auth, conexão Firebird e `WEBHOOK_URL`.
3. Mantenha `TIMEZONE=America/Sao_Paulo`.

## Execução

```bash
npm start
```

Para desenvolvimento:

```bash
npm run dev
```

## Estrutura

```text
src/
  app.js
  server.js
  config/
  constants/
  controllers/
  middlewares/
  routes/
  services/
  utils/
docs/
  estrutura-do-projeto.md
```

## Endpoints Preservados

- `GET /`
- `GET /api/reports`
- `GET /api/atualizartodos/:pasta`
- `GET /api/atualizaexeheralav/:pasta`
- `GET /api/atualizaexeheraerp/:pasta`
- `GET /api/atualizaexecommerce/:pasta`
- `POST /api/upload/:pasta`
- `app.use('/reports', auth, express.static(REPORTS_DIR));`

## Variáveis de Ambiente

- `PORT`
- `REPORTS_DIR`
- `REPORTS_DIR2`
- `REPORTS_DIR3`
- `REPORTS_DIR4`
- `LOGS_DIR`
- `BACKUP_DIR`
- `BASIC_AUTH_USER`
- `BASIC_AUTH_PASS`
- `FB_HOST`
- `FB_PORT`
- `FB_DATABASE`
- `FB_USER`
- `FB_PASSWORD`
- `FB_ROLE`
- `FB_PAGE_SIZE`
- `WEBHOOK_URL`
- `TIMEZONE`
