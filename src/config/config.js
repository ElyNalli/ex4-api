module.exports = {
  PORTA: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "segredo-do-trabalho-fatec",
  JWT_EXPIRA: "1h",
  USUARIO: process.env.API_USER || "admin",
  SENHA: process.env.API_PASS || "123456"
};