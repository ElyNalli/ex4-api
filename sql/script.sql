CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  data_nascimento TEXT NOT NULL,
  cep TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('Regular', 'VIP', 'Atacado')),
  limite_credito REAL NOT NULL DEFAULT 0,
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO clientes (nome, email, cpf, data_nascimento, cep, categoria, limite_credito) VALUES
  ('Ana Souza', 'ana@email.com', '52998224725', '1998-03-15', '13465000', 'VIP', 1500.00),
  ('Bruno Lima', 'bruno@email.com', '11144477735', '1995-07-22', '13400000', 'Regular', 500.00),
  ('Carla Mendes', 'carla@email.com', '12345678909', '2001-11-05', '13450000', 'Atacado', 3000.00);