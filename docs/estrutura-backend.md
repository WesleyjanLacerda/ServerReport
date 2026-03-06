# Estrutura do Backend

## Visão geral

O backend foi movido para `backend/` mantendo CommonJS e a API antiga intacta.

```text
backend/
  .env
  .env.example
  package.json
  server.js
  src/
    app.js
    config/
    constants/
    controllers/
    middlewares/
    repositories/
    routes/
    scripts/
    services/
    utils/
  db/
    migrations/
  logs/
```

## Camadas

- `config`: leitura do `.env`, paths e configuração do Firebird.
- `controllers`: entrada HTTP das rotas antigas e novas.
- `middlewares`: Basic Auth, upload, log de requisição e error handler.
- `repositories`: consultas Firebird do painel.
- `routes`: agrupamento das rotas antigas e do painel.
- `services`: integração com Firebird, webhook, zip e regras de negócio.
- `utils`: datas, paths, arquivos, texto e helpers de request.
- `scripts`: scripts operacionais, como a aplicação das colunas de revisão.

## Compatibilidade preservada

Os endpoints antigos continuam com o mesmo comportamento externo. A refatoração foi estrutural: organização de código, não mudança de contrato.
