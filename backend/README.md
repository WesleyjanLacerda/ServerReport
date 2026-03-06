# Backend ServerReport

Backend Node.js/Express da API legada de relatórios e upload de backups, agora reorganizado dentro de `backend/` e estendido com os endpoints do painel web.

## Executar

```bash
npm install
npm start
```

Para desenvolvimento:

```bash
npm run dev
```

Para aplicar as colunas de revisão no Firebird:

```bash
npm run migrate:backup-review-columns
```

## Compatibilidade preservada

As rotas antigas continuam com os mesmos paths, autenticação Basic Auth, headers e parâmetros:

- `GET /`
- `GET /api/reports`
- `GET /api/atualizartodos/:pasta`
- `GET /api/atualizaexeheralav/:pasta`
- `GET /api/atualizaexeheraerp/:pasta`
- `GET /api/atualizaexecommerce/:pasta`
- `POST /api/upload/:pasta`
- `app.use('/reports', auth, express.static(REPORTS_DIR));`

## Painel novo

Rotas adicionais do painel:

- `GET /api/painel/backups`
- `GET /api/painel/backups/empresas`
- `GET /api/painel/backups/:id`
- `PUT /api/painel/backups/:id/revisar`
- `PUT /api/painel/backups/:id/desrevisar`
- `GET /api/painel/backups/resumo`

Quando existir build em `../frontend/dist`, o backend também serve a interface em `/painel`.
