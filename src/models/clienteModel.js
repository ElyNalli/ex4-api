const db = require("../database/db");

const POR_PAGINA = 5;

function listar({ busca = "", pagina = 1 }) {
  const termo = `%${busca}%`;
  const digitos = busca.replace(/\D/g, "");
  const termoCpf = `%${digitos}%`;

  const filtro = `WHERE nome LIKE ? OR email LIKE ? OR (? <> '' AND cpf LIKE ?)`;

  const total = db
    .prepare(`SELECT COUNT(*) AS n FROM clientes ${filtro}`)
    .get(termo, termo, digitos, termoCpf).n;

  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  pagina = Math.min(Math.max(1, pagina), paginas);

  const itens = db
    .prepare(`SELECT * FROM clientes ${filtro} ORDER BY nome LIMIT ? OFFSET ?`)
    .all(
      termo,
      termo,
      digitos,
      termoCpf,
      POR_PAGINA,
      (pagina - 1) * POR_PAGINA,
    );

  return { itens, total, pagina, paginas };
}

function buscarPorId(id) {
  return db.prepare("SELECT * FROM clientes WHERE id = ?").get(id);
}

function criar(d) {
  return db
    .prepare(
      `INSERT INTO clientes (nome, email, cpf, data_nascimento, cep, categoria, limite_credito)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      d.nome,
      d.email,
      d.cpf,
      d.data_nascimento,
      d.cep,
      d.categoria,
      d.limite_credito,
    );
}

function atualizar(id, d) {
  return db
    .prepare(
      `UPDATE clientes
       SET nome = ?, email = ?, cpf = ?, data_nascimento = ?, cep = ?, categoria = ?, limite_credito = ?
       WHERE id = ?`,
    )
    .run(
      d.nome,
      d.email,
      d.cpf,
      d.data_nascimento,
      d.cep,
      d.categoria,
      d.limite_credito,
      id,
    );
}

function excluir(id) {
  return db.prepare("DELETE FROM clientes WHERE id = ?").run(id);
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
