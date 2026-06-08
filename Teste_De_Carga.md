# MEDIÇÕES DO SLA - Projeto Alchemical

## Nome do Serviço 1: Sistema de Autenticação (Registro de Usuário)

* **Tipo de operações:** Inserção (Signup / Cadastro)
* **Arquivos envolvidos:** `managers/AuthManager.js`, `managers/RegisterManager.js`
* **Arquivos com o código fonte de medição:** `testes_de_carga/teste_auth.js`
* **Data da medição:** 01/06/2026
* **Descrição das configurações:** Backend utilizando Supabase (PostgreSQL) hospedado em nuvem (plano gratuito). Testes executados via K6 a partir de máquina local (Windows 11, K6 v2.0.0).
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio):** 41.74ms
  * **Vazão:** 14.51 requisições por segundo
  * **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
  * **Gráficos / Resultados:** * **Gráficos / Resultados:** ![Resultado do Teste de Progresso](testes_de_carga/teste1.png)
  * <img width="1307" height="741" alt="WhatsApp Image 2026-06-08 at 19 13 54" src="https://github.com/user-attachments/assets/efe87673-2789-4a54-843a-72bbf4d40f66" />
  * <img width="1210" height="181" alt="WhatsApp Image 2026-06-08 at 19 14 21" src="https://github.com/user-attachments/assets/e0980fd1-015e-4ca9-b805-ff5bea6aee81" />



* **LEVANTAMENTO DE HIPÓTESES:**
  * O teste demonstrou que o sistema não suporta alta concorrência de cadastros vindos da mesma origem (IP). O Supabase ativou o seu mecanismo de defesa de rede (*Rate Limiting*) para rotas de Autenticação, permitindo apenas 1 cadastro com sucesso e bloqueando imediatamente as outras 1748 requisições para evitar ataques de Spam/DDoS. A latência média foi baixíssima (41.74ms) justamente porque o firewall bloqueou o acesso no *Edge* (borda da rede), antes mesmo de sobrecarregar a CPU do banco de dados principal. Portanto, o principal gargalo de vazão nesta funcionalidade é a política de segurança da API externa.

## Nome do Serviço 2: Salvamento de Progresso
* **Tipo de operações:** Inserção / Escrita no Banco (Tabela de Progresso)
* **Arquivos envolvidos:** `managers/ProgressManager.js`
* **Arquivos com o código fonte de medição:** `testes_de_carga/teste_progresso.js`
* **Data da medição:** 01/06/2026
* **Descrição das configurações:** Backend utilizando Supabase (PostgreSQL) na nuvem (plano gratuito). Testes via K6 a partir de máquina local (Windows 11).
* **Testes de carga (SLA):**
  * **Latência (Tempo de resposta médio):** 36.98ms
  * **Vazão:** 14.58 requisições por segundo
  * **Concorrência:** Máximo de 20 usuários virtuais simultâneos (VUs)
  * **Gráficos / Resultados:** ![Resultado do Teste de Autenticação](testes_de_carga/teste2.png)
  * <img width="1315" height="807" alt="WhatsApp Image 2026-06-08 at 19 18 39 (1)" src="https://github.com/user-attachments/assets/d205914b-38c9-4696-a70d-b46c670e9b9c" />
  *<img width="1258" height="205" alt="WhatsApp Image 2026-06-08 at 19 19 02 (1)" src="https://github.com/user-attachments/assets/74b2878f-be7e-49ef-bb85-ada6ee8790bd" />






* **LEVANTAMENTO DE HIPÓTESES:**
  * O teste da funcionalidade de escrita revelou um potencial gargalo de segurança na camada de API (*API Gateway* do Supabase). A operação apresentou 100% de falha com uma latência extremamente baixa (36.98ms). A hipótese é que requisições em massa (*burst*) tentando escrever diretamente na base sem um Token de Sessão válido (JWT) são sumariamente bloqueadas pelas políticas de segurança de tabela (RLS - *Row Level Security*). Isso protege o banco de dados contra a exaustão de conexões e sobrecarga de I/O no disco, mas demonstra que gargalos de vazão em operações de inserção estão fortemente atrelados à validação de autenticação em tempo real.
---

