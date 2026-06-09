# MEDIÇÕES DO SLA - Fase E: 1ª Medição dos Testes de Carga

**Integrantes:** Enzo Henrique de Oliveira Paulino, Maria Eduarda Guedes Correia, Leticia Martins Vianna

---

## Nome do Serviço 1: Autenticação de Usuário (Login)

* **Tipo de operações:** Leitura (Consulta de validação na base de dados)
* **Arquivos envolvidos:** `[server.js](https://github.com/dudaguedesc/Alchemical/blob/main/server.js)`, banco local.
* **Arquivos com o código fonte de medição:** `[teste_login.js](https://github.com/dudaguedesc/Alchemical/blob/main/testes_de_carga/teste_login.js)`
* **Data da medição:** 08/06/2026
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em banco de dados local. Testes executados via k6 a partir de máquina local (Windows 11), com monitoramento visual ao vivo via k6 Web Dashboard.

### Testes de carga (SLA)
* **Latência (Tempo de resposta médio p95):** 6.62 ms
* **Vazão:** 37 requisições por segundo
* **Concorrência:** Máximo de 50 usuários virtuais simultâneos (VUs)
* **Taxa de Falha Observada:** 100% (4.520 falhas)
* **Gráficos evolutivos (Aferição Visual):**
  *(Gráfico ilustrando o gargalo de falhas e tempo de resposta escalando sob carga de 50 VUs)*
  ![Gráfico Login Falha](https://github.com/user-attachments/assets/32013663-0923-47d8-a7e7-2be3a757ee66)
  *(SLA de tempo de resposta não atendido)*
  ![Gráfico Login Checks](https://github.com/user-attachments/assets/f8c4f1d3-c66e-4950-9d3f-faf2a7b88e83)

### LEVANTAMENTO DE HIPÓTESES dos potenciais gargalos do sistema
Ao injetar 50 VUs simultâneos, o sistema colapsou. A principal hipótese para este gargalo é a ausência de indexação (índices B-Tree) na tabela de contas. Sem um índice composto para `email` e `senha`, o banco de dados é forçado a realizar um *Full Table Scan* (varredura completa) para cada uma das requisições. O acúmulo dessas operações sequenciais longas saturou as threads do Node.js, gerando fila de espera, estourando o tempo limite (*timeout*) e resultando em 100% de falha na entrega do serviço.

---

## Nome do Serviço 2: Cadastro de Novo Jogador (Registro)

* **Tipo de operações:** Inserção (Escrita Transacional na base de dados)
* **Arquivos envolvidos:** `[server.js](https://github.com/dudaguedesc/Alchemical/blob/main/server.js)`
* **Arquivos com o código fonte de medição:** `[teste_auth.js](https://github.com/dudaguedesc/Alchemical/blob/main/testes_de_carga/teste_auth.js)`
* **Data da medição:** 08/06/2026
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em banco de dados local. Testes executados via k6 a partir de máquina local (Windows 11).

### Testes de carga (SLA)
* **Latência (Tempo de resposta médio p95):** 0.75 ms
* **Vazão:** 15 requisições por segundo em média (Total de 1.800 requisições)
* **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
* **Taxa de Falha Observada:** 0%
* **Gráficos evolutivos (Aferição Visual):**
  *(Gráfico de inserção comportando 20 VUs)*
  ![Resultado do Teste de Cadastro 1](https://github.com/user-attachments/assets/efe87673-2789-4a54-843a-72bbf4d40f66)
  ![Resultado do Teste de Cadastro 2](https://github.com/user-attachments/assets/e0980fd1-015e-4ca9-b805-ff5bea6aee81)

### LEVANTAMENTO DE HIPÓTESES dos potenciais gargalos do sistema
Operações de inserção são intrinsecamente mais custosas pois exigem que o banco de dados realize um *Lock* (bloqueio de escrita) na tabela para garantir a integridade da transação. Atualmente, sob carga de apenas 20 VUs, o sistema consegue processar a fila. Contudo, a hipótese de gargalo evidente é que, caso a aplicação escale para um número maior de usuários simultâneos, o modelo tradicional de *Lock* global do banco causará retenção nas portas locais, travando a vazão e escalando a latência drasticamente.

---

## Nome do Serviço 3: Salvamento de Progresso

* **Tipo de operações:** Escrita/Atualização no Banco (Tabela de Progresso)
* **Arquivos envolvidos:** `[server.js](https://github.com/dudaguedesc/Alchemical/blob/main/server.js)`
* **Arquivos com o código fonte de medição:** `[teste_progresso.js](https://github.com/dudaguedesc/Alchemical/blob/main/testes_de_carga/teste_progresso.js)`
* **Data da medição:** 08/06/2026
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em banco de dados local. Testes executados via k6 a partir de máquina local (Windows 11).

### Testes de carga (SLA)
* **Latência (Tempo de resposta médio p95):** 0.81 ms
* **Vazão:** 15 requisições por segundo
* **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
* **Taxa de Falha Observada:** 29 requisições perdidas (Pico de falhas)
* **Gráficos evolutivos (Aferição Visual):**
  *(Aferição revelando o pico de falhas [linha vermelha] na retenção de conexões)*
  ![Resultado do Teste de Progresso 1](https://github.com/user-attachments/assets/d205914b-38c9-4696-a70d-b46c670e9b9c)
  ![Resultado do Teste de Progresso 2](https://github.com/user-attachments/assets/74b2878f-be7e-49ef-bb85-ada6ee8790bd)

### LEVANTAMENTO DE HIPÓTESES dos potenciais gargalos do sistema
O gráfico evolutivo revelou um gargalo real ocorrendo durante eventos simultâneos de escrita. A principal hipótese é a saturação por contenção (*Database Lock*). Quando o k6 encerra as conexões em lote (ramp-down), múltiplas requisições tentam gravar o progresso final simultaneamente. O banco de dados local não suportou a concorrência de escrita assíncrona, enfileirando as conexões no driver até que 29 delas atingissem o *Timeout* (falha por recusa de conexão). É necessário implementar um modo de registro de gravação antecipada (como o WAL) para resolver esse estrangulamento.