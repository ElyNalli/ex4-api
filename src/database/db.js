const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database(path.join(__dirname, "../../dados.db"));
db.pragma("journal_mode = WAL");

// Cria a tabela (e dados de exemplo) se ainda não existirem
const script = fs.readFileSync(
  path.join(__dirname, "../../sql/script.sql"),
  "utf8",
);
db.exec(script);

module.exports = db;
