const CATEGORIAS = ["Regular", "VIP", "Atacado"];

function cpfValido(cpf) {
  cpf = String(cpf).replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(cpf[i]) * (t + 1 - i);
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(cpf[t])) return false;
  }
  return true;
}

function dataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const data = new Date(texto + "T00:00:00");
  if (isNaN(data.getTime())) return false;
  if (data.toISOString().slice(0, 10) !== texto) return false;
  return data <= new Date() && data.getFullYear() >= 1900;
}

function validar(body) {
  const erros = {};

  const limite = parseFloat(
    String(body.limite_credito ?? "").replace(",", "."),
  );

  const dados = {
    nome: (body.nome || "").trim(),
    email: (body.email || "").trim().toLowerCase(),
    cpf: (body.cpf || "").replace(/\D/g, ""),
    data_nascimento: (body.data_nascimento || "").trim(),
    cep: (body.cep || "").replace(/\D/g, ""),
    categoria: body.categoria || "",
    limite_credito: isNaN(limite) ? body.limite_credito || "" : limite,
  };

  if (dados.nome.length < 3)
    erros.nome = "Informe o nome completo (mínimo 3 letras).";
  if (!/^\S+@\S+\.\S+$/.test(dados.email))
    erros.email = "Digite um e-mail válido.";
  if (!cpfValido(dados.cpf)) erros.cpf = "CPF inválido.";
  if (!dataValida(dados.data_nascimento))
    erros.data_nascimento = "Informe uma data de nascimento válida.";
  if (dados.cep.length !== 8) erros.cep = "O CEP deve ter 8 números.";
  if (!CATEGORIAS.includes(dados.categoria))
    erros.categoria = "Selecione uma categoria.";
  if (isNaN(limite) || limite < 0)
    erros.limite_credito = "Informe um valor maior ou igual a zero.";

  return { erros, dados };
}

module.exports = { validar, CATEGORIAS };
