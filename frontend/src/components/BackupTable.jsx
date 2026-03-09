import StatusBadge from './StatusBadge';
import { formatBytes, formatDateTime } from '../utils/formatters';

const getDisplayUser = (item) => {
  if (item.revisado) {
    return item.usuarioRevisao || item.usuario || '-';
  }

  return item.usuario || '-';
};

const BackupTable = ({ items, loading, actionLoadingId, onReview, onUnreview, onViewDetails }) => {
  if (loading) {
    return <div className="py-10 text-sm text-slate-500">Carregando logs...</div>;
  }

  if (!items.length) {
    return <div className="py-10 text-sm text-slate-500">Nenhum backup encontrado para os filtros selecionados.</div>;
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-400">
            <th className="px-3">Revisado</th>
            <th className="px-3">Data/Hora</th>
            <th className="px-3">Empresa</th>
            <th className="px-3">Arquivo</th>
            <th className="px-3">Tamanho</th>
            <th className="px-3">Status</th>
            <th className="px-3">Usuario</th>
            <th className="px-3">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="rounded-3xl bg-slate-50 text-sm text-slate-600">
              <td className="rounded-l-3xl px-3 py-4">
                <StatusBadge tone={item.revisado ? 'info' : 'neutral'}>
                  {item.revisado ? 'REVISADO' : 'NAO REVISADO'}
                </StatusBadge>
              </td>
              <td className="px-3 py-4 font-medium text-ink">{formatDateTime(item.dataHoraUpload)}</td>
              <td className="px-3 py-4">{item.empresa}</td>
              <td className="max-w-[260px] px-3 py-4 truncate font-medium text-ink">{item.nomeArquivo}</td>
              <td className="px-3 py-4">{formatBytes(item.tamanhoBytes)}</td>
              <td className="px-3 py-4">
                <StatusBadge tone={item.status === 'ERRO' ? 'error' : 'success'}>{item.status || '-'}</StatusBadge>
              </td>
              <td className="px-3 py-4">{getDisplayUser(item)}</td>
              <td className="rounded-r-3xl px-3 py-4">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onViewDetails(item)} className="rounded-xl border border-stroke px-3 py-2 text-xs font-semibold text-slate-700">
                    Ver detalhes
                  </button>
                  {item.revisado ? (
                    <button
                      type="button"
                      onClick={() => onUnreview(item)}
                      disabled={actionLoadingId === item.id}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Desmarcar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReview(item)}
                      disabled={actionLoadingId === item.id}
                      className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Revisar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackupTable;
