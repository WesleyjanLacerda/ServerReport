# Banco de Backups

## Tabela principal

A tabela de acompanhamento do painel é `BACKUP_UPLOAD_LOG`.

Campos já utilizados pela API legada:

- `ID`
- `EMPRESA`
- `USUARIO`
- `IP_ORIGEM`
- `HOST_ORIGEM`
- `CAMINHO_ARQUIVO`
- `NOME_ARQUIVO`
- `TAMANHO_BYTES`
- `DATA_HORA_UPLOAD`
- `STATUS`
- `MENSAGEM_ERRO`
- `WEBHOOK_STATUS`
- `WEBHOOK_RESPOSTA`

## Novas colunas de revisão

Foram preparadas as seguintes colunas:

- `REVISADO CHAR(1)`
- `DATA_HORA_REVISAO TIMESTAMP`
- `USUARIO_REVISAO VARCHAR(120)`
- `OBS_REVISAO VARCHAR(500)`

## Arquivos criados

- Script SQL idempotente: [20260306_add_backup_review_columns.sql](/c:/HeraSis/ServerReport/backend/db/migrations/20260306_add_backup_review_columns.sql)
- Runner Node: [apply-backup-review-columns.js](/c:/HeraSis/ServerReport/backend/src/scripts/apply-backup-review-columns.js)

## Fluxo de revisão

1. O painel lista os registros de `BACKUP_UPLOAD_LOG`.
2. O usuário visualiza detalhes do log.
3. Ao marcar como revisado, o backend grava `REVISADO = 'S'`, `DATA_HORA_REVISAO = CURRENT_TIMESTAMP`, `USUARIO_REVISAO` e `OBS_REVISAO`.
4. Ao desmarcar, os campos de revisão são limpos.

## Endpoints que usam a tabela

- `GET /api/painel/backups`
- `GET /api/painel/backups/empresas`
- `GET /api/painel/backups/:id`
- `PUT /api/painel/backups/:id/revisar`
- `PUT /api/painel/backups/:id/desrevisar`
- `GET /api/painel/backups/resumo`
