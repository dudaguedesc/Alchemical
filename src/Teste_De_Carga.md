# MEDIÇÕES DO SLA - Projeto Alchemical

##servidor_falso.js é o arquivo que foi utilizado para usarmos o node.js para nos possibilitar a execução dos testes, ele não se encontra upado no github, porém posso adiciona-lo caso seja necesario - enzohop

## Nome do Serviço 1: Autenticação de Usuário (Login)

* **Tipo de operações:** Leitura (Consulta de validação na base de dados)
* **Arquivos envolvidos:** `servidor_falso.js`, `alchemical_db.sql`
* **Arquivos com o código fonte de medição:** `teste_login.js`
* **Data da medição:** 08/06/2026
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em Banco de Dados Relacional MySQL local, gerenciado via driver `mysql2` utilizando um Pool de Conexões (Connection Limit: 20). Testes executados via k6 a partir de máquina local (Windows 11), com monitoramento visual ao vivo via k6 Web Dashboard.
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 1.67 ms
  * **Vazão:** 37 requisições por segundo (Total de 4.532 requisições completadas)
  * **Concorrência:** Máximo de 50 usuários virtuais simultâneos (VUs)
  * **Gráficos / Resultados:** * **
  * <img width="1312" height="757" alt="WhatsApp Image 2026-06-08 at 19 27 27 (1)" src="https://github.com/user-attachments/assets/32013663-0923-47d8-a7e7-2be3a757ee66" />
  * <img width="1252" height="205" alt="WhatsApp Image 2026-06-08 at 19 27 44 (1)" src="https://github.com/user-attachments/assets/f8c4f1d3-c66e-4950-9d3f-faf2a7b88e83" />



* **LEVANTAMENTO DE HIPÓTESES:**
  * O excelente tempo de resposta (1.67 ms) e a taxa zero de erros (0.00%) mesmo com 50 VUs disputando um pool de 20 conexões comprovam a alta eficácia do ecossistema assíncrono do Node.js. O MySQL processou as validações de credenciais rapidamente devido à boa estruturação da tabela. Caso a tabela de contas cresça exponencialmente no futuro, a ausência de um índice composto (`email` + `senha`) poderá transformar essas buscas em *Full Table Scans*, o que fatalmente aumentaria a latência e criaria um gargalo de tempo de resposta além do limite do SLA.

## Nome do Serviço 2: Cadastro de Novo Jogador (Registro)

* **Tipo de operações:** Inserção (Escrita Transacional na base de dados)
* **Arquivos envolvidos:** `servidor_falso.js`
* **Arquivos com o código fonte de medição:** `teste_auth.js`
* **Data da medição:** 08/06/2026
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em Banco de Dados Relacional MySQL local, gerenciado via driver `mysql2` utilizando um Pool de Conexões (Connection Limit: 20). Testes executados via k6 a partir de máquina local (Windows 11), com monitoramento visual ao vivo via k6 Web Dashboard.
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 0.75 ms
  * **Vazão:** 15 requisições por segundo em média (Total de 1.800 requisições)
  * **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
  * **Gráficos / Resultados:** ![Resultado do Teste de Cadastro](testes_de_carga/teste1.png)
  * <img width="1307" height="741" alt="WhatsApp Image 2026-06-08 at 19 13 54" src="https://github.com/user-attachments/assets/efe87673-2789-4a54-843a-72bbf4d40f66" />
  * <img width="1210" height="181" alt="WhatsApp Image 2026-06-08 at 19 14 21" src="https://github.com/user-attachments/assets/e0980fd1-015e-4ca9-b805-ff5bea6aee81" />

* **LEVANTAMENTO DE HIPÓTESES:**
  * Como a criação de um novo registro exige verificação de unicidade no banco (Unique Constraint no E-mail), operações de inserção costumam ser mais custosas computacionalmente do que leituras. Contudo, ao configurar o limitador de VUs do k6 (20) em sincronia exata com o limite do Pool de Conexões do MySQL (20), o sistema não gerou filas de espera nas threads. Isso resultou em um Throughput estável e um P95 abaixo de 1 milissegundo (0.75 ms) sem nenhuma falha HTTP. O gargalo só se formará se o número de cadastros simultâneos ultrapassar significativamente a capacidade do Pool.

## Nome do Serviço 3: Salvamento de Progresso

* **Tipo de operações:** Escrita/Atualização no Banco (Tabela de Progresso)
* **Arquivos envolvidos:** `servidor_falso.js`
* **Arquivos com o código fonte de medição:** `teste_progresso.js`
* **Data da medição:** 08/06/2026
* **Descrição das configurações:** Servidor Node.js utilizando o framework Express rodando localmente (Porta 3000). Persistência em Banco de Dados Relacional MySQL local, gerenciado via driver `mysql2` utilizando um Pool de Conexões (Connection Limit: 20). Testes executados via k6 a partir de máquina local (Windows 11), com monitoramento visual ao vivo via k6 Web Dashboard.
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio p95):** 0.81 ms
  * **Vazão:** 15 requisições por segundo (Total de 1.822 requisições com sucesso)
  * **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
  * **Gráficos / Resultados:** ![Resultado do Teste de Progresso](testes_de_carga/teste2.png)
  * <img width="1315" height="807" alt="WhatsApp Image 2026-06-08 at 19 18 39 (1)" src="https://github.com/user-attachments/assets/d205914b-38c9-4696-a70d-b46c670e9b9c" />
  * <img width="1258" height="205" alt="WhatsApp Image 2026-06-08 at 19 19 02 (1)" src="https://github.com/user-attachments/assets/74b2878f-be7e-49ef-bb85-ada6ee8790bd" />

* **LEVANTAMENTO DE HIPÓTESES:**
  * Embora a latência tenha se mantido impecável no P95 (0.81ms), o teste registrou um leve pico de falhas (29 requisições perdidas) visível no gráfico de linha exatamente durante o período de *ramp-down* (desaceleração do teste). As hipóteses para este leve colapso momentâneo são: (1) O fechamento prematuro de Sockets pelo sistema operacional do Windows em ambiente local no momento em que o k6 começou a drenar as VUs ativas para zero; ou (2) A saturação momentânea do Pool, onde eventos concorrentes de finalização extrapolaram a fila de espera do driver `mysql2`, gerando um *timeout* interno de rede (Connection Refused) antes que a porta fosse liberada.
