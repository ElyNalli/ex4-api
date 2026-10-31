const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const { enviarErro } = require("../helpers/erros");

module.exports = (req, res, next) => {
  const cabecalho = req.headers.authorization || "";
  const [tipo, token] = cabecalho.split(" ");

  if (tipo !== "Bearer" || !token) {
    return enviarErro(res, 401, "TOKEN_AUSENTE", "Envie o token no cabeçalho Authorization: Bearer <token>.");
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return enviarErro(res, 401, "TOKEN_EXPIRADO", "Token expirado. Faça login novamente.");
    }
    return enviarErro(res, 401, "TOKEN_INVALIDO", "Token inválido.");
  }
};