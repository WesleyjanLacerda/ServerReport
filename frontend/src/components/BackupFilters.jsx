import { useEffect, useState } from 'react';

const BackupFilters = ({ empresas, filters, onSubmit, onClear }) => {
  const [formState, setFormState] = useState(filters);

  useEffect(() => {
    setFormState(filters);
  }, [filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <section className="mt-6 rounded-[28px] border border-stroke bg-white p-5 shadow-panel sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-ink">Filtros</h2>
        <p className="text-sm text-slate-500">Os filtros ficam em uma faixa compacta para consulta rápida.</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <form className="flex min-w-max items-end gap-3" onSubmit={handleSubmit}>
          <label className="block min-w-[180px]">
            <span className="mb-2 block text-sm font-medium text-slate-600">Empresa</span>
            <select className="w-full rounded-2xl border border-stroke bg-slate-50 px-3 py-2.5 text-sm" name="empresa" value={formState.empresa} onChange={handleChange}>
              <option value="">Todas</option>
              {empresas.map((empresa) => (
                <option key={empresa} value={empresa}>{empresa}</option>
              ))}
            </select>
          </label>

          <label className="block min-w-[152px]">
            <span className="mb-2 block text-sm font-medium text-slate-600">Data inicial</span>
            <input className="w-full rounded-2xl border border-stroke bg-slate-50 px-3 py-2.5 text-sm" type="date" name="dataIni" value={formState.dataIni} onChange={handleChange} />
          </label>

          <label className="block min-w-[152px]">
            <span className="mb-2 block text-sm font-medium text-slate-600">Data final</span>
            <input className="w-full rounded-2xl border border-stroke bg-slate-50 px-3 py-2.5 text-sm" type="date" name="dataFim" value={formState.dataFim} onChange={handleChange} />
          </label>

          <label className="block min-w-[132px]">
            <span className="mb-2 block text-sm font-medium text-slate-600">Status</span>
            <select className="w-full rounded-2xl border border-stroke bg-slate-50 px-3 py-2.5 text-sm" name="status" value={formState.status} onChange={handleChange}>
              <option value="">Todos</option>
              <option value="SUCESSO">SUCESSO</option>
              <option value="ERRO">ERRO</option>
            </select>
          </label>

          <label className="block min-w-[150px]">
            <span className="mb-2 block text-sm font-medium text-slate-600">Webhook</span>
            <select className="w-full rounded-2xl border border-stroke bg-slate-50 px-3 py-2.5 text-sm" name="webhookStatus" value={formState.webhookStatus} onChange={handleChange}>
              <option value="">Todos</option>
              <option value="ENVIADO">ENVIADO</option>
              <option value="FALHOU">FALHOU</option>
            </select>
          </label>

          <label className="block min-w-[150px]">
            <span className="mb-2 block text-sm font-medium text-slate-600">Revisado</span>
            <select className="w-full rounded-2xl border border-stroke bg-slate-50 px-3 py-2.5 text-sm" name="revisado" value={formState.revisado} onChange={handleChange}>
              <option value="">Todos</option>
              <option value="S">Revisado</option>
              <option value="N">Nao revisado</option>
            </select>
          </label>

          <div className="flex items-end gap-3 pb-[1px]">
            <button type="submit" className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Filtrar
            </button>
            <button type="button" onClick={onClear} className="rounded-2xl border border-stroke px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Limpar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BackupFilters;
