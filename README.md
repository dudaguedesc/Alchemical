O Alchemical é um jogo educacional em formato de RPG de fantasia voltado ao ensino de lógica de programação para iniciantes.  
O projeto combina narrativa imersiva, exploração de cenários e desafios lógicos utilizando blocos visuais e fluxogramas.

Sobre o Projeto:

O primeiro contato com programação costuma ser difícil para muitos estudantes, principalmente pela abstração dos conceitos e pela dificuldade em visualizar a aplicação prática da lógica.
O Alchemical busca resolver esse problema através de uma experiência gamificada, onde a programação é apresentada como uma forma de “alquimia” capaz de controlar máquinas, mecanismos e elementos do ambiente.
O jogador explora um mundo de fantasia, interage com NPCs, resolve desafios lógicos e desbloqueia novas áreas conforme progride na narrativa.

Escopo inicial:

O sistema, em sua versão inicial, contempla:
● Exploração de cenários virtuais e interação com objetos e mecanismos específicos
integrados ao ambiente de jogo;
● Interface gráfica para resolução de desafios lógicos, permitindo a construção de
algoritmos através de blocos visuais ou fluxogramas;
● Sistema de validação de soluções com execução sequencial e visualização passo a
passo das ações no ambiente virtual;
● Apresentação de narrativa imersiva, incluindo eventos, diálogos dinâmicos e
progressão de história baseada no sucesso do jogador;
● Gerenciamento de progresso e fornecimento de pistas pedagógicas, com
disponibilização de relatórios de desempenho para o usuário acompanhante.
● Módulo de autenticação com suporte a login via e-mail ou conta Google que garanta o
salvamento do progresso do jogador em nuvem.

*O sistema não inclui:*

● Suporte a sessões de jogo cooperativas ou interações síncronas entre múltiplos
jogadores (multiplayer) na mesma instância do ambiente;
● Funcionalidades de criação de desafios personalizados ou edição de mapas por parte
dos usuários finais;
● Integração técnica com sistemas acadêmicos externos da universidade ou outras
plataformas de ensino de terceiros;
● Suporte pedagógico direto ou orientação presencial mediada por administradores por
meio do sistema.

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

* **LEVANTAMENTO DE HIPÓTESES:**
  * O teste da funcionalidade de escrita revelou um potencial gargalo de segurança na camada de API (*API Gateway* do Supabase). A operação apresentou 100% de falha com uma latência extremamente baixa (36.98ms). A hipótese é que requisições em massa (*burst*) tentando escrever diretamente na base sem um Token de Sessão válido (JWT) são sumariamente bloqueadas pelas políticas de segurança de tabela (RLS - *Row Level Security*). Isso protege o banco de dados contra a exaustão de conexões e sobrecarga de I/O no disco, mas demonstra que gargalos de vazão em operações de inserção estão fortemente atrelados à validação de autenticação em tempo real.
---




Integrantes:
Enzo Henrique de Oliveira Paulino
Maria Eduarda Guedes Correia
Leticia Martins Vianna
