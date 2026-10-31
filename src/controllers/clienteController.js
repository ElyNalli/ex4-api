const Cliente = require("../models/clienteModel");
const { validar } = require("../validators/clienteValidator");
const { enviarErro } = require("../helpers/erros");

const idValido = id => /^\d+$/.test(id);

function erroDeDuplicado(e) {
  const detalhes = {};
  if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
    if (e.message.includes("cpf")) detalhes.cpf = "Já existe um cliente com este CPF.";
    if (e.message.includes("email")) detalhes.email = "Já existe um cliente com este e-mail.";
  }
  return detalhes;
}

exports.listar = (req, res) => {
  const busca = (req.query.busca || "").trim();
  const pagina = parseInt(req.query.pagina) || 1;
  const { itens, total, pagina: atual, paginas } = Cliente.listar({ busca, pagina });

  res.status(200).json({
    dados: itens,
    paginacao: { total, pagina: atual, paginas, por_pagina: 5 }
  });
};

exports.buscar = (req, res) => {
  if (!idValido(req.params.id)) {
    return enviarErro(res, 400, "ID_INVALIDO", "O id deve ser um número.");
  }
  const cliente = Cliente.buscarPorId(req.params.id);
  if (!cliente) return enviarErro(res, 404, "NAO_ENCONTRADO", "Cliente não encontrado.");
  res.status(200).json(cliente);
};

exports.criar = (req, res, next) => {
  const { erros, dados } = validar(req.body || {});
  if (Object.keys(erros).length) {
    return enviarErro(res, 400, "VALIDACAO", "Dados inválidos.", erros);
  }

  try {
    const info = Cliente.criar(dados);
    const criado = Cliente.buscarPorId(info.lastInsertRowid);
    res.status(201).location(`/clientes/${criado.id}`).json(criado);
  } catch (e) {
    const duplicado = erroDeDuplicado(e);
    if (Object.keys(duplicado).length) {
      return enviarErro(res, 409, "DUPLICADO", "Cliente já cadastrado.", duplicado);
    }
    next(e);
  }
};

exports.atualizar = (req, res, next) => {
  const id = req.params.id;
  if (!idValido(id)) return enviarErro(res, 400, "ID_INVALIDO", "O id deve ser um número.");
  if (!Cliente.buscarPorId(id)) return enviarErro(res, 404, "NAO_ENCONTRADO", "Cliente não encontrado.");

  const { erros, dados } = validar(req.body || {});
  if (Object.keys(erros).length) {
    return enviarErro(res, 400, "VALIDACAO", "Dados inválidos.", erros);
  }

  try {
    Cliente.atualizar(id, dados);
    res.status(200).json(Cliente.buscarPorId(id));
  } catch (e) {
    const duplicado = erroDeDuplicado(e);
    if (Object.keys(duplicado).length) {
      return enviarErro(res, 409, "DUPLICADO", "CPF ou e-mail já usado por outro cliente.", duplicado);
    }
    next(e);
  }
};

exports.excluir = (req, res) => {
  const id = req.params.id;
  if (!idValido(id)) return enviarErro(res, 400, "ID_INVALIDO", "O id deve ser um número.");

  const resultado = Cliente.excluir(id);
  if (resultado.changes === 0) {
    return enviarErro(res, 404, "NAO_ENCONTRADO", "Cliente não encontrado.");
  }
  res.status(204).send();
};