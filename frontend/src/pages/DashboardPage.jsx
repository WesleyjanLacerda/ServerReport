import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCards from '../components/SummaryCards';
import BackupFilters from '../components/BackupFilters';
import BackupTable from '../components/BackupTable';
import BackupDetailsModal from '../components/BackupDetailsModal';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import {
  fetchBackupCompanies,
  fetchBackupSummary,
  fetchBackups,
  markReviewed,
  unmarkReviewed
} from '../services/api';
import { getDefaultDateRange } from '../utils/dates';

const STORAGE_KEY = 'painel-backup-auth';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (error) {
      return null;
    }
  });
  const [filters, setFilters] = useState(() => ({
    ...getDefaultDateRange(),
    empresa: '',
    status: '',
    webhookStatus: '',
    revisado: 'N',
    page: 1,
    limit: 20
  }));
  const [summary, setSummary] = useState({
    total: 0,
    sucesso: 0,
    erro: 0,
    webhookFalhou: 0,
    pendentesRevisao: 0
  });
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [empresas, setEmpresas] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2800);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    if (!auth?.nome) {
      navigate('/login');
      return;
    }

    fetchBackupCompanies()
      .then((response) => setEmpresas(response.items || []))
      .catch((err) => setError(err.response?.data?.error || err.message || 'Erro ao carregar empresas.'));
  }, [auth, navigate]);

  const loadData = async (activeFilters, options = {}) => {
    const { showLoader = true } = options;

    if (showLoader) {
      setLoading(true);
    }

    setError('');

    try {
      const [summaryResponse, backupsResponse] = await Promise.all([
        fetchBackupSummary(activeFilters),
        fetchBackups(activeFilters)
      ]);

      setSummary(summaryResponse);
      setItems(backupsResponse.items || []);
      setPagination(backupsResponse.pagination || { page: 1, limit: activeFilters.limit, total: 0, totalPages: 0 });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao carregar backups.');
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData(filters, { showLoader: true });
  }, []);

  const handleFilter = (nextFilters) => {
    const normalizedFilters = {
      ...nextFilters,
      page: 1,
      limit: filters.limit
    };

    setFilters(normalizedFilters);
    loadData(normalizedFilters, { showLoader: true });
  };

  const handleClear = () => {
    const resetFilters = {
      ...getDefaultDateRange(),
      empresa: '',
      status: '',
      webhookStatus: '',
      revisado: 'N',
      page: 1,
      limit: filters.limit
    };

    setFilters(resetFilters);
    loadData(resetFilters, { showLoader: true });
  };

  const handlePageChange = (page) => {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    loadData(nextFilters, { showLoader: true });
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const runReviewAction = async (item, mode, obsRevisao = '') => {
    setActionLoadingId(item.id);
    const currentScrollY = window.scrollY;

    try {
      let response;

      if (mode === 'review') {
        response = await markReviewed(item.id, {
          usuarioRevisao: auth.nome,
          obsRevisao
        });
        setToast({ type: 'success', message: `Backup ${item.nomeArquivo} marcado como revisado.` });
      } else {
        response = await unmarkReviewed(item.id);
        setToast({ type: 'info', message: `Revisao removida de ${item.nomeArquivo}.` });
      }

      const updatedItem = response?.item || null;

      setItems((currentItems) => currentItems.map((currentItem) => (
        currentItem.id === item.id ? updatedItem || currentItem : currentItem
      )));

      if (selectedItem?.id === item.id) {
        setSelectedItem(updatedItem);
      }

      await loadData(filters, { showLoader: false });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao atualizar revisao.');
      setToast({ type: 'error', message: 'Nao foi possivel atualizar a revisao.' });
    } finally {
      setActionLoadingId(null);
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: currentScrollY, behavior: 'auto' });
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-shell">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[30px] bg-[linear-gradient(135deg,_#142132_0%,_#1f3d54_55%,_#0f766e_100%)] px-6 py-8 text-white shadow-panel sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Painel de Backups</p>
              <h1 className="mt-3 text-3xl font-semibold">Acompanhamento diario das cargas e revisoes</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                Filtros rapidos, visao resumida, detalhes completos e marcacao de revisao dos envios de backup.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm">
                Revisor atual: <strong>{auth?.nome}</strong>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <SummaryCards summary={summary} />

        <BackupFilters
          empresas={empresas}
          filters={filters}
          onClear={handleClear}
          onSubmit={handleFilter}
        />

        <section className="mt-6 rounded-[28px] border border-stroke bg-white p-4 shadow-panel sm:p-6">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">Logs de backup</h2>
              <p className="text-sm text-slate-500">Ordenacao padrao por data/hora decrescente.</p>
            </div>
            {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
          </div>

          <BackupTable
            items={items}
            loading={loading}
            actionLoadingId={actionLoadingId}
            onReview={(item) => runReviewAction(item, 'review')}
            onUnreview={(item) => runReviewAction(item, 'unreview')}
            onViewDetails={handleViewDetails}
          />

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </section>
      </div>

      <BackupDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onReview={(item, obsRevisao) => runReviewAction(item, 'review', obsRevisao)}
        onUnreview={(item) => runReviewAction(item, 'unreview')}
        actionLoadingId={actionLoadingId}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default DashboardPage;
