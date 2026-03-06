const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination.totalPages || pagination.totalPages <= 1) {
    return null;
  }

  const pages = [];
  for (let page = 1; page <= pagination.totalPages; page += 1) {
    pages.push(page);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
      <p className="text-sm text-slate-500">
        Total: <strong>{pagination.total}</strong> registros
      </p>
      <div className="flex flex-wrap gap-2">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              page === pagination.page ? 'bg-ink text-white' : 'border border-stroke text-slate-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
