const cards = [
  { key: 'total', label: 'Total de backups', accent: 'bg-slate-900 text-white' },
  { key: 'sucesso', label: 'Sucesso', accent: 'bg-emerald-100 text-emerald-700' },
  { key: 'erro', label: 'Erro', accent: 'bg-rose-100 text-rose-700' },
  { key: 'pendentesRevisao', label: 'Pendentes de revisao', accent: 'bg-sky-100 text-sky-700' }
];

const SummaryCards = ({ summary }) => (
  <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {cards.map((card) => (
      <article key={card.key} className="rounded-[24px] border border-stroke bg-white p-5 shadow-panel">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.accent}`}>
          {card.label}
        </span>
        <p className="mt-5 text-4xl font-semibold text-ink">{summary[card.key] || 0}</p>
      </article>
    ))}
  </section>
);

export default SummaryCards;
