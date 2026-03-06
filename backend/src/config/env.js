const path = require('path');
const dotenv = require('dotenv');

const BACKEND_ROOT = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(BACKEND_ROOT, '..');

dotenv.config({ path: path.resolve(BACKEND_ROOT, '.env') });

const env = {
  backendRoot: BACKEND_ROOT,
  repoRoot: REPO_ROOT,
  port: Number(process.env.PORT || 15099),
  reportsDir: process.env.REPORTS_DIR || 'D:\\Scripts\\Reports',
  reportsDir2: process.env.REPORTS_DIR2 || 'D:\\Update\\HeraLav',
  reportsDir3: process.env.REPORTS_DIR3 || 'D:\\Update\\HeraERP',
  reportsDir4: process.env.REPORTS_DIR4 || 'D:\\Update\\Commerce',
  logsDir: process.env.LOGS_DIR || path.join(BACKEND_ROOT, 'logs'),
  backupDir: process.env.BACKUP_DIR || 'D:\\BACKUP',
  basicAuthUser: process.env.BASIC_AUTH_USER || 'herasoft',
  basicAuthPass: process.env.BASIC_AUTH_PASS || '451263',
  webhookUrl: process.env.WEBHOOK_URL || 'https://heradash.bubbleapps.io/api/1.1/wf/backup_logs/',
  timezone: process.env.TIMEZONE || 'America/Sao_Paulo',
  frontendDistDir: process.env.FRONTEND_DIST_DIR || path.join(REPO_ROOT, 'frontend', 'dist'),
  firebird: {
    host: process.env.FB_HOST || '127.0.0.1',
    port: Number(process.env.FB_PORT || 3050),
    database: process.env.FB_DATABASE || path.join(BACKEND_ROOT, 'db', 'DB.GDB'),
    user: process.env.FB_USER || 'SYSDBA',
    password: process.env.FB_PASSWORD || 'masterkey',
    role: process.env.FB_ROLE || null,
    pageSize: Number(process.env.FB_PAGE_SIZE || 4096)
  }
};

module.exports = env;
