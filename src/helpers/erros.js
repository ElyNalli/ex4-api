function enviarErro(res, status, codigo, mensagem, detalhes) {
  const erro = { status, codigo, mensagem };
  if (detalhes) erro.detalhes = detalhes;
  return res.status(status).json({ erro });
}

module.exports = { enviarErro };