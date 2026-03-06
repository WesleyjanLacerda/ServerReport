import { useEffect, useState } from 'react';
import StatusBadge from './StatusBadge';
import { formatBytes, formatDateTime } from '../utils/formatters';

const fields = [
  ['ID', 'id'],
  ['Empresa', 'empresa'],
  ['Usuario', 'usuario'],
  ['IP', 'ipOrigem'],
  ['Host', 'hostOrigem'],
  ['Caminho completo', 'caminhoArquivo'],
  ['Nome do arquivo', 'nomeArquivo'],
  ['Tamanho', 'tamanhoBytes'],
  ['Data/Hora', 'dataHoraUpload'],
  ['Mensagem de erro', 'mensagemErro'],
  ['Webhook resposta', 'webhookResposta'],
  ['Data/Hora revisao', 'dataHoraRevisao'],
  ['Usuario revisao', 'usuarioRevisao'],
  ['Observacao revisao', 'obsRevisao']
];

const formatValue = (field, value) => {
  if (!value && value !== 0) {
    return '-';
  }

  if (field === 'tamanhoBytes') {
    return formatBytes(value);
  }

  if (field === 'dataHoraUpload' || field === 'dataHoraRevisao') {
    return formatDateTime(value);
  }

  return value;
};

const BackupDetailsModal = ({ item, onClose, onReview, onUnreview, actionLoadingId }) => {
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    setObservacao(item?.obsRevisao || '');
  }, [item]);

  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-panel">
        <div className="border-b border-slate-100 bg-white px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Detalhes do log</p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">{item.nomeArquivo}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={item.status === 'ERRO' ? 'error' : 'success'}>{item.status || '-'}</StatusBadge>
              <StatusBadge tone={item.webhookStatus === 'FALHOU' ? 'warning' : 'success'}>
                {item.webhookStatus || '-'}
              </StatusBadge>
              <StatusBadge tone={item.revisado ? 'info' : 'neutral'}>
                {item.revisado ? 'REVISADO' : 'NAO REVISADO'}
              </StatusBadge>

              {item.revisado ? (
                <button
                  type="button"
                  onClick={() => onUnreview(item)}
                  disabled={actionLoadingId === item.id}
                  className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Desmarcar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onReview(item, observacao)}
                  disabled={actionLoadingId === item.id}
                  className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Marcar revisado
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-stroke px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([label, field]) => (
              <div key={field} className="rounded-3xl border border-stroke bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-2 break-words text-sm leading-7 text-slate-700">{formatValue(field, item[field])}</p>
              </div>
            ))}

            <div className="rounded-3xl border border-stroke bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Webhook status</p>
              <div className="mt-3">
                <StatusBadge tone={item.webhookStatus === 'FALHOU' ? 'warning' : 'success'}>
                  {item.webhookStatus || '-'}
                </StatusBadge>
              </div>
            </div>

            <div className="rounded-3xl border border-stroke bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Revisado</p>
              <div className="mt-3">
                <StatusBadge tone={item.revisado ? 'info' : 'neutral'}>
                  {item.revisado ? 'SIM' : 'NAO'}
                </StatusBadge>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-stroke bg-slate-50 p-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Observacao da revisao
              </span>
              <textarea
                className="mt-3 min-h-28 w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-accent"
                placeholder="Opcional: registre o contexto da revisao."
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupDetailsModal;
