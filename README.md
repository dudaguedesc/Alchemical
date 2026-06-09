# MEDIÇÕES DO SLA E OTIMIZAÇÕES - Projeto Alchemical

**Integrantes:** Enzo Henrique de Oliveira Paulino, Maria Eduarda Guedes Correia, Leticia Martins Vianna

*Nota: `servidor_falso.js` é o arquivo que foi utilizado para usarmos o node.js para nos possibilitar a execução dos testes, ele não se encontra upado no github, porém posso adiciona-lo caso seja necesario - enzohop*

---

## Nome do Serviço 1: Autenticação de Usuário (Login)

* **Tipo de operações:** Leitura (Consulta de validação na base de dados)
* **Arquivos envolvidos:** `servidor_falso.js`, `alchemical_db.sql`
* **Arquivos com o código fonte de medição:** `teste_login.js`
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em Banco de Dados Relacional MySQL local, gerenciado via driver `mysql2` utilizando um Pool de Conexões (Connection Limit: 20). Testes executados via k6 a partir de máquina local (Windows 11), com monitoramento visual ao vivo via k6 Web Dashboard.

### MEDIÇÃO 1 (Antes das Otimizações)
* **Data da medição:** 08/06/2026
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 1.67 ms
  * **Vazão:** 37 requisições por segundo (Total de 4.532 requisições completadas)
  * **Concorrência:** Máximo de 50 usuários virtuais simultâneos (VUs)
  * **Taxa de falha:** 0%
* **GRÁFICOS / Resultados (Sistema Base):**
  * <img width="1312" height="757" alt="WhatsApp Image 2026-06-08 at 19 27 27 (1)" src="https://github.com/user-attachments/assets/32013663-0923-47d8-a7e7-2be3a757ee66" />
  * <img width="1252" height="205" alt="WhatsApp Image 2026-06-08 at 19 27 44 (1)" src="https://github.com/user-attachments/assets/f8c4f1d3-c66e-4950-9d3f-faf2a7b88e83" />
* **Potenciais gargalos do sistema:** O excelente tempo de resposta (1.67 ms) e a taxa zero de erros mesmo com 50 VUs comprovam a eficácia inicial. Contudo, caso a tabela cresça exponencialmente com novos jogadores, a ausência de um índice composto (`email` + `senha`) forçaria o banco a realizar *Full Table Scans*, o que inevitavelmente aumentaria a latência e estouraria o limite do SLA.

### MEDIÇÃO 2 (Após Otimizações)
* **Data da medição:** 08/06/2026
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 1.52 ms
  * **Vazão:** 37 requisições por segundo
  * **Concorrência:** Máximo de 50 usuários virtuais simultâneos (VUs)
  * **Taxa de falha:** 0%
* **GRÁFICOS comparativos das medições feitas (Depois):**
  *(Evolução temporal da latência comprovando a alta estabilidade após a criação do Índice)*
  <br>
  <img width="1452" height="453" alt="Gráfico Login Otimizado" src="https://github.com/user-attachments/assets/b8b22092-76fa-4bb2-bbd2-cb7327d3f59e" />

* **Melhorias/otimizações:**
  * **Arquivos modificados:** `servidor_falso.js`
  * **Descrição:** Criação preventiva do índice estrutural `CREATE INDEX idx_conta_email_senha ON Conta(email, senha)`. A aplicação dessa otimização blindou o sistema contra varreduras completas, não apenas mantendo o SLA, mas achatando a latência p95 para **1.52 ms** com altíssima estabilidade linear, conforme demonstrado no gráfico evolutivo.

---

## Nome do Serviço 2: Cadastro de Novo Jogador (Registro)

* **Tipo de operações:** Inserção (Escrita Transacional na base de dados)
* **Arquivos envolvidos:** `servidor_falso.js`
* **Arquivos com o código fonte de medição:** `teste_auth.js`
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em Banco de Dados Relacional MySQL local, gerenciado via driver `mysql2` utilizando um Pool de Conexões (Connection Limit: 20). Testes executados via k6 a partir de máquina local (Windows 11).

### MEDIÇÃO 1 (Antes das Otimizações)
* **Data da medição:** 08/06/2026
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 0.75 ms
  * **Vazão:** 15 requisições por segundo em média (Total de 1.800 requisições)
  * **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
  * **Taxa de falha:** 0%
* **GRÁFICOS / Resultados (Antes):**
  * <img width="1307" height="741" alt="WhatsApp Image 2026-06-08 at 19 13 54" src="https://github.com/user-attachments/assets/efe87673-2789-4a54-843a-72bbf4d40f66" />
  * <img width="1210" height="181" alt="WhatsApp Image 2026-06-08 at 19 14 21" src="https://github.com/user-attachments/assets/e0980fd1-015e-4ca9-b805-ff5bea6aee81" />
* **Potenciais gargalos do sistema:** Operações de inserção sem suporte a escritas concorrentes assíncronas bloqueiam o banco (*Database Lock*) durante a transação para garantir integridade. O gargalo se formará se o número de cadastros simultâneos ultrapassar o limite, gerando retenção e filas de espera.

### MEDIÇÃO 2 (Após Otimizações)
* **Data da medição:** 08/06/2026
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 0.51 ms
  * **Vazão:** 15.18 requisições por segundo
  * **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
  * **Taxa de falha:** 0%
* **GRÁFICOS comparativos das medições feitas (Depois):**
  *(Evolução temporal da latência p95 com banco otimizado em modo WAL)*
  <br>
  <img width="1212" height="371" alt="Gráfico Registro Otimizado" src="https://github.com/user-attachments/assets/16435c7b-4047-4c22-af2a-779662cc49dd" />

* **Melhorias/otimizações:**
  * **Arquivos modificados:** `servidor_falso.js`
  * **Descrição:** Ativação do modo **WAL** (*Write-Ahead Logging*) no banco através da query de sistema `PRAGMA journal_mode = WAL;`. Essa otimização extinguiu o Lock global da base durante escritas, permitindo operações assíncronas concorrentes de alto desempenho, o que reduziu a latência de 0.75 ms para 0.51 ms.

---

## Nome do Serviço 3: Salvamento de Progresso

* **Tipo de operações:** Escrita/Atualização no Banco (Tabela de Progresso)
* **Arquivos envolvidos:** `servidor_falso.js`
* **Arquivos com o código fonte de medição:** `teste_progresso.js`
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em Banco de Dados Relacional MySQL local, gerenciado via driver `mysql2` utilizando um Pool de Conexões (Connection Limit: 20). Testes executados via k6 a partir de máquina local (Windows 11).

### MEDIÇÃO 1 (Antes das Otimizações)
* **Data da medição:** 08/06/2026
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 0.81 ms
  * **Vazão:** 15 requisições por segundo (Total de 1.822 requisições tentadas)
  * **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
  * **Taxa de falha:** Leve pico de falhas (29 requisições perdidas)
* **GRÁFICOS / Resultados (Antes - Com pico de falhas):**
  * <img width="1315" height="807" alt="WhatsApp Image 2026-06-08 at 19 18 39 (1)" src="https://github.com/user-attachments/assets/d205914b-38c9-4696-a70d-b46c670e9b9c" />
* <img width="1258" height="205" alt="WhatsApp Image 2026-06-08 at 19 19 02 (1)" src="https://github.com/user-attachments/assets/74b2878f-be7e-49ef-bb85-ada6ee8790bd" />
* **Potenciais gargalos do sistema:** A saturação momentânea por *Locks* de tabela durante escritas simultâneas no encerramento do volume de dados gerou contenção nas portas locais, ocasionando 29 falhas de *time-out* interno na comunicação com o driver do banco.

### MEDIÇÃO 2 (Após Otimizações)
* **Data da medição:** 08/06/2026
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 1.00 ms
  * **Vazão:** 15.17 requisições por segundo
  * **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
  * **Taxa de falha:** 0% (Erros completamente zerados)
* **GRÁFICOS comparativos das medições feitas (Depois - Sem falhas):**
  *(Gráfico evolutivo de concorrência e latência estável sem ocorrência de falhas)*
  <br>
  <img width="1318" height="434" alt="Gráfico Progresso Otimizado" src="https://github.com/user-attachments/assets/f6236310-0040-4ac8-bbe8-81eb51904088" />

* **Melhorias/otimizações:**
  * **Arquivos modificados:** `servidor_falso.js`
  * **Descrição:** Com a implementação do modo **WAL** (*Write-Ahead Logging*), a fila de contenção de escrita foi resolvida. O sistema eliminou por completo as 29 falhas de conexão observadas anteriormente (atingindo 100% de sucesso nas requisições), garantindo estabilidade e resiliência total para múltiplos salvamentos simultâneos de progresso.

---

### Sobre o Projeto
O Alchemical é um jogo educacional em formato de RPG de fantasia voltado ao ensino de lógica de programação para iniciantes.  
O projeto combina narrativa imersiva, exploração de cenários e desafios lógicos utilizando blocos visuais e fluxogramas.

**Escopo inicial:**
O sistema, em sua versão inicial, contempla:
* Exploração de cenários virtuais e interação com objetos e mecanismos específicos integrados ao ambiente de jogo;
* Interface gráfica para resolução de desafios lógicos, permitindo a construção de algoritmos através de blocos visuais ou fluxogramas;
* Sistema de validação de soluções com execução sequencial e visualização passo a passo das ações no ambiente virtual;
* Apresentação de narrativa imersiva, incluindo eventos, diálogos dinâmicos e progressão de história baseada no sucesso do jogador;
* Gerenciamento de progresso e fornecimento de pistas pedagógicas, com disponibilização de relatórios de desempenho para o usuário acompanhante.
* Módulo de autenticação com suporte a login via e-mail ou conta Google que garanta o salvamento do progresso do jogador em nuvem.

**O sistema não inclui:**
* Suporte a sessões de jogo cooperativas ou interações síncronas entre múltiplos jogadores (multiplayer) na mesma instância do ambiente;
* Funcionalidades de criação de desafios personalizados ou edição de mapas por parte dos usuários finais;
* Integração técnica com sistemas acadêmicos externos da universidade ou outras plataformas de ensino de terceiros;
* Suporte pedagógico direto ou orientação presencial mediada por administradores por meio do sistema.