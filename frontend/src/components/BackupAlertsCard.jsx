import { formatDateTime } from '../utils/formatters';

const getStatusLabel = (item) => {
  if (item.statusAlerta === 'nunca_enviou_backup') {
    return 'Nunca enviou backup';
  }

  return 'Backup atrasado';
};

const BackupAlertsCard = ({ items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <section className="mt-6 rounded-[28px] border border-rose-200 bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffffff_50%,_#fff1f2_100%)] p-5 shadow-panel sm:p-6">
      <div className="flex flex-col gap-3 border-b border-rose-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">Alerta de monitoramento</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">Empresas sem backup dentro do prazo</h2>
        </div>
        <span className="inline-flex w-fit rounded-full bg-rose-600 px-3 py-1 text-sm font-semibold text-white">
          {items.length} alerta{items.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-sm shadow-rose-100/60"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-base font-semibold text-ink">{item.empresa}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Limite configurado: {item.horasLimiteSemBackup || 24}h
                </p>
                {item.observacao ? <p className="mt-2 text-sm text-slate-500">{item.observacao}</p> : null}
              </div>

              <div className="flex flex-col gap-2 lg:items-end">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    item.statusAlerta === 'nunca_enviou_backup'
                      ? 'bg-slate-900 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {getStatusLabel(item)}
                </span>
                <p className="text-sm text-slate-600">
                  {item.ultimoBackupEm
                    ? `Ultimo backup: ${formatDateTime(item.ultimoBackupEm)}`
                    : 'Ultimo backup: nao encontrado'}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BackupAlertsCard;
