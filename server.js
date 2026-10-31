const express = require("express");
const cors = require("cors");
const { PORTA } = require("./src/config/config");
const auth = require("./src/middlewares/auth");
const { enviarErro } = require("./src/helpers/erros");
const rotasAuth = require("./src/routes/authRoutes");
const rotasClientes = require("./src/routes/clienteRoutes");

const app = express();

app.use(cors());         
app.use(express.json());  

app.get("/", (req, res) => {
  res.json({ api: "API de Clientes - Loja da Mica", versao: "1.0.0" });
});

app.use("/auth", rotasAuth);                
app.use("/clientes", auth, rotasClientes);  

// Rota inexistente
app.use((req, res) => {
  enviarErro(res, 404, "ROTA_NAO_ENCONTRADA", `Rota ${req.method} ${req.originalUrl} não existe.`);
});

// Erros gerais
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return enviarErro(res, 400, "JSON_INVALIDO", "O corpo da requisição não é um JSON válido.");
  }
  console.error(err);
  enviarErro(res, 500, "ERRO_INTERNO", "Erro interno do servidor.");
});

app.listen(PORTA, () => {
  console.log(`API rodando em http://localhost:${PORTA}`);
});