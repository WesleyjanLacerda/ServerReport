const panelAuthService = require('../services/panel-auth.service');

const listUsers = async (req, res, next) => {
  try {
    const items = await panelAuthService.listUsers();
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const loginValue = String(req.body?.login || '').trim();
    const senha = String(req.body?.senha || '');

    if (!loginValue || !senha) {
      res.status(400).json({ error: 'Informe usuario e senha.' });
      return;
    }

    const user = await panelAuthService.login({ login: loginValue, senha });
    if (!user) {
      res.status(401).json({ error: 'Usuario ou senha invalidos.' });
      return;
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  login
};
