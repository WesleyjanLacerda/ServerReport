import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ''
});

const cleanParams = (params) => Object.fromEntries(
  Object.entries(params).filter(([, value]) => value !== '' && value != null)
);

export const fetchPanelUsers = async () => {
  const response = await api.get('/api/painel/usuarios');
  return response.data;
};

export const loginPanel = async (payload) => {
  const response = await api.post('/api/painel/login', payload);
  return response.data;
};

export const fetchBackups = async (params) => {
  const response = await api.get('/api/painel/backups', { params: cleanParams(params) });
  return response.data;
};

export const fetchBackupSummary = async (params) => {
  const response = await api.get('/api/painel/backups/resumo', { params: cleanParams(params) });
  return response.data;
};

export const fetchBackupCompanies = async () => {
  const response = await api.get('/api/painel/backups/empresas');
  return response.data;
};

export const fetchBackupMissingAlerts = async () => {
  const response = await api.get('/api/painel/backups/alertas/sem-backup');
  return response.data;
};

export const fetchBackupDetails = async (id) => {
  const response = await api.get(`/api/painel/backups/${id}`);
  return response.data;
};

export const markReviewed = async (id, payload) => {
  const response = await api.put(`/api/painel/backups/${id}/revisar`, payload);
  return response.data;
};

export const unmarkReviewed = async (id) => {
  const response = await api.put(`/api/painel/backups/${id}/desrevisar`);
  return response.data;
};
