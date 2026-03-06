import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPanelUsers, loginPanel } from '../services/api';

const STORAGE_KEY = 'painel-backup-auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem(STORAGE_KEY);
    if (auth) {
      navigate('/dashboard');
      return;
    }

    fetchPanelUsers()
      .then((response) => {
        const items = response.items || [];
        setUsuarios(items);
        if (items[0]?.login) {
          setLogin(items[0].login);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || 'Erro ao carregar usuarios.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!login || !senha) {
      setError('Selecione o usuario e informe a senha.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await loginPanel({ login, senha });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Falha no login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(20,83,45,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-panel lg:grid-cols-[1.2fr_0.8fr]">
        <section className="relative hidden min-h-[640px] overflow-hidden bg-[linear-gradient(140deg,_#09121d_0%,_#102739_48%,_#14532d_100%)] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(255,255,255,0.14),_transparent_24%),radial-gradient(circle_at_75%_30%,_rgba(16,185,129,0.22),_transparent_28%),radial-gradient(circle_at_50%_80%,_rgba(59,130,246,0.2),_transparent_26%)]" />
          <div className="absolute left-10 top-12 h-40 w-40 rounded-full border border-white/10 bg-white/5 blur-sm motion-safe:animate-float" />
          <div className="absolute bottom-16 right-12 h-52 w-52 rounded-full border border-emerald-200/10 bg-emerald-300/10 blur-md motion-safe:animate-float-delayed" />

          <div className="relative z-10 flex h-full flex-col justify-between px-12 py-14 text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-emerald-100/90">Herasoft</p>
              <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-[1.05]">
                Acompanhamento de Backups
              </h1>
            </div>

            <div className="max-w-xl rounded-[30px] border border-white/10 bg-white/10 p-8 backdrop-blur-md">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Painel</p>
                  <p className="mt-2 text-lg font-semibold">Revisao diaria</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Acesso</p>
                  <p className="mt-2 text-lg font-semibold">Usuarios validados</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Fluxo</p>
                  <p className="mt-2 text-lg font-semibold">Analise e confirmacao</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Painel Web</p>
            <h2 className="mt-4 text-3xl font-semibold text-ink">Login</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Selecione um usuario ativo e informe a senha para acessar o painel.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Usuario</span>
                <select
                  className="w-full rounded-2xl border border-stroke bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:bg-white"
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                  disabled={loading || submitting}
                >
                  <option value="">Selecione</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.login}>
                      {usuario.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Senha</span>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-stroke bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:bg-white"
                  placeholder="Informe a senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  disabled={loading || submitting}
                />
              </label>

              {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

              <button
                type="submit"
                disabled={loading || submitting}
                className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {submitting ? 'Entrando...' : 'Entrar no painel'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
