# Estrutura do Frontend

## Visão geral

O frontend foi criado em `frontend/` com React + Vite + Tailwind para o painel de acompanhamento dos backups.

```text
frontend/
  public/
  src/
    App.jsx
    main.jsx
    pages/
      LoginPage.jsx
      DashboardPage.jsx
    components/
      SummaryCards.jsx
      BackupFilters.jsx
      BackupTable.jsx
      BackupDetailsModal.jsx
      StatusBadge.jsx
      Pagination.jsx
    services/
      api.js
    utils/
      formatters.js
      dates.js
    styles/
      index.css
```

## Fluxo

- `LoginPage.jsx`: coleta o nome do usuário localmente e prepara a futura autenticação real.
- `DashboardPage.jsx`: carrega resumo, filtros, listagem paginada e detalhes.
- `services/api.js`: concentra o consumo dos endpoints `/api/painel/backups`.
- `utils/dates.js`: define o padrão de ontem e amanhã na abertura da tela.

## Execução

- Desenvolvimento: `npm run dev`
- Build: `npm run build`

Por padrão, o Vite usa proxy para `http://localhost:15099` durante o desenvolvimento.
