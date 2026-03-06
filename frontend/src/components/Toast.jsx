const toneClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700'
};

const Toast = ({ toast, onClose }) => {
  if (!toast) {
    return null;
  }

  return (
    <div className="fixed right-5 top-5 z-[70] w-full max-w-sm">
      <div className={`toast-enter rounded-[28px] border px-5 py-4 shadow-panel backdrop-blur ${toneClasses[toast.type] || toneClasses.info}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-current opacity-80" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em]">Painel</p>
              <p className="mt-1 text-sm font-medium leading-6">{toast.message}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80 transition hover:opacity-100">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
