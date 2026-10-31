const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRA, USUARIO, SENHA } = require("../config/config");
const { enviarErro } = require("../helpers/erros");

exports.login = (req, res) => {
  const { usuario, senha } = req.body || {};

  if (!usuario || !senha) {
    return enviarErro(res, 400, "DADOS_INVALIDOS", "Informe usuario e senha.");
  }
  if (usuario !== USUARIO || senha !== SENHA) {
    return enviarErro(res, 401, "CREDENCIAIS_INVALIDAS", "Usuário ou senha incorretos.");
  }

  const token = jwt.sign({ usuario }, JWT_SECRET, { expiresIn: JWT_EXPIRA });
  res.status(200).json({ token, tipo: "Bearer", expira_em: JWT_EXPIRA });
};