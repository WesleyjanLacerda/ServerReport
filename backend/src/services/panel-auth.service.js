const panelUserRepository = require('../repositories/panel-user.repository');
const { hashPassword } = require('../utils/hash.utils');

const listUsers = async () => panelUserRepository.listActivePanelUsers();

const login = async ({ login, senha }) => {
  const user = await panelUserRepository.findPanelUserByLogin(login);
  if (!user || !user.ativo) {
    return null;
  }

  if (user.senhaHash !== hashPassword(senha)) {
    return null;
  }

  return {
    id: user.id,
    nome: user.nome,
    login: user.login
  };
};

module.exports = {
  listUsers,
  login
};
