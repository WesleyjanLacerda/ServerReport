const readline = require('readline');
const { hashPassword } = require('../utils/hash.utils');

const passwordFromArgs = () => {
  const arg = process.argv.slice(2).find((item) => item.startsWith('--senha='));
  if (!arg) {
    return null;
  }

  return arg.slice('--senha='.length);
};

const readPassword = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Digite a senha para gerar o SHA-256: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const run = async () => {
  const password = passwordFromArgs() ?? await readPassword();

  if (!password) {
    console.error('Senha nao informada.');
    process.exitCode = 1;
    return;
  }

  console.log(hashPassword(password));
};

run().catch((error) => {
  console.error('Erro ao gerar hash da senha:', error.message || error);
  process.exitCode = 1;
});
