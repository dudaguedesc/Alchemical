const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// cria um arquivo chamado "banco_local.sqlite" na pasta
const db = new sqlite3.Database('./banco_local.sqlite');

// cria as tabelas automaticamente se elas não existirem
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Conta (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, senha TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS Progresso (id INTEGER PRIMARY KEY AUTOINCREMENT, email_jogador TEXT, fase_atual INTEGER, pontuacao INTEGER)");
});

// rota de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.all('SELECT * FROM Conta WHERE email = ? AND senha = ?', [email, password], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (rows.length > 0) {
      res.status(200).json({ mensagem: "Login efetuado com sucesso!" });
    } else {
      res.status(401).json({ mensagem: "Credenciais invalidas" });
    }
  });
});

// rota de progresso (escrita no HD)
app.post('/api/progresso', (req, res) => {
  const { email_jogador, fase_atual, pontuacao } = req.body;
  db.run('INSERT INTO Progresso (email_jogador, fase_atual, pontuacao) VALUES (?, ?, ?)', 
  [email_jogador, fase_atual, pontuacao], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ mensagem: "Progresso salvo no banco local com sucesso!" });
  });
});

// rota de registro (escrita no HD)
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  db.run('INSERT INTO Conta (email, senha) VALUES (?, ?)', 
  [email, password], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ mensagem: "Registro efetuado no banco local com sucesso!" });
  });
});

app.listen(3000, () => {
  console.log("==================================================");
  console.log(" SERVIDOR SQLITE RODANDO EM LOCALHOST:3000");
  console.log("==================================================");
});