# ServerReport

Monorepo com backend e frontend separados para a API legada de relatórios/backups e o novo painel web de acompanhamento.

## Estrutura

```text
ServerReport/
  backend/
  frontend/
  docs/
  README.md
```

## Backend

O backend preserva integralmente a superfície da API antiga:

- mesmas URLs antigas
- mesmo Basic Auth
- mesmos headers
- mesmo parâmetro `:pasta`
- mesmo campo de upload `file`

Além disso, foram adicionados os endpoints do painel em `/api/painel/backups` e o servidor pode publicar o build do frontend em `/painel`.

## Frontend

O frontend fica em `frontend/`, usa React + Vite + Tailwind e entrega:

- login visual simples, preparado para autenticação futura
- cards de resumo
- filtros por empresa, período, status, webhook e revisão
- tabela paginada
- modal de detalhes
- ações para marcar e desmarcar revisão

As datas padrão do dashboard são `dataIni = ontem` e `dataFim = amanhã`.

## Como rodar

Backend:

```bash
cd backend
npm install
npm start
```

Frontend em desenvolvimento:

```bash
cd frontend
npm install
npm run dev
```

Build do frontend:

```bash
cd frontend
npm run build
```

Atalhos na raiz:

```bash
npm run backend:start
npm run backend:dev
npm run backend:migrate:backup-review-columns
npm run frontend:dev
npm run frontend:build
```

## Configuração

- Backend: ajuste `backend/.env` com base em `backend/.env.example`.
- Frontend: opcionalmente defina `frontend/.env` com `VITE_API_BASE_URL` se a API estiver em outra origem.

## Banco Firebird

O script idempotente de alteração da tabela está em [backend/db/migrations/20260306_add_backup_review_columns.sql](/c:/HeraSis/ServerReport/backend/db/migrations/20260306_add_backup_review_columns.sql).

O runner Node para aplicar a alteração usando a configuração atual do projeto está em [backend/src/scripts/apply-backup-review-columns.js](/c:/HeraSis/ServerReport/backend/src/scripts/apply-backup-review-columns.js).

## Documentação complementar

- [estrutura-backend.md](/c:/HeraSis/ServerReport/docs/estrutura-backend.md)
- [estrutura-frontend.md](/c:/HeraSis/ServerReport/docs/estrutura-frontend.md)
- [banco-backups.md](/c:/HeraSis/ServerReport/docs/banco-backups.md)
