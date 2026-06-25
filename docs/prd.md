# 📄 Product Requirements Document (PRD) - Letzify

**Projeto:** Letzify (Gestão de Identidades Visuais)  
**Versão:** 1.1.0 (Refinada para Entrega Acadêmica com Rastreabilidade Técnica)  
**Status:** 🟢 Definido (MVP)

---

## 🎯 1. Visão Geral e Objetivo

O processo de gestão de identidade visual costuma ficar fragmentado entre pastas, mensagens e ferramentas isoladas. O **Letzify** centraliza esse fluxo para que designers e clientes organizem projetos de branding com segurança, consistência e rastreabilidade.

O objetivo do MVP é entregar uma plataforma full-cycle com backend em NestJS, frontend web integrado, autenticação JWT, documentação OpenAPI, qualidade com TDD/Jest e operação contínua com CI/CD.

## 📖 2. Glossário Ubíquo

- **Projeto de Identidade Visual:** Entidade principal que agrupa elementos de branding de uma marca.
- **Paleta:** Conjunto de cores vinculadas a um projeto.
- **Tipografia:** Conjunto de fontes e regras tipográficas vinculadas a um projeto.
- **Asset Visual:** Arquivo de marca (logo, ícone, imagem institucional) associado ao projeto.
- **Monorepo:** Estratégia de versionamento em um único repositório para frontend e backend.
- **Pipeline CI:** Fluxo automatizado de validação (lint/testes) antes do merge.

## 👤 3. Atores e Permissões

- **Administrador (Admin):** Gerencia usuários, permissões e governança técnica da plataforma.
- **Designer:** Cria e mantém projetos, paletas, tipografias e assets.
- **Cliente:** Consulta ativos e acompanha entregas permitidas pelo projeto.
- **Sistema (Automático):** Valida autenticação, aplica regras de autorização, padroniza respostas/erros e executa integrações de entrega contínua.

## 📝 4. Escopo Funcional, Histórias de Usuário e Critérios de Aceitação (MoSCoW)

> **Instrução para IA/Desenvolvedor:** Cada história abaixo é critério de entrega acadêmica. Uma história só pode ser considerada Done quando todos os critérios de aceitação forem atendidos e sua rastreabilidade de checklist estiver comprovada.

### 🔴 US01 - Documentação de Produto e Arquitetura (Must Have)

**Ator:** Desenvolvedor | **História:** Como desenvolvedor, quero estruturar PRD e SDD com apoio de IA para garantir clareza de negócio e desenho técnico antes da implementação.

**✅ Critérios de Aceitação:**

- [ ] O PRD e o SDD devem estar versionados na pasta docs.
- [ ] O SDD deve conter diagrama Mermaid aderente ao domínio de identidade visual.
- [ ] O documento deve explicitar decisões arquiteturais relevantes para o MVP.
- [ ] Deve existir referência cruzada entre os documentos no README.

**🔎 Rastreabilidade Checklist:** ID1

### 🔴 US02 - Monorepo e Fluxo GitFlow (Must Have)

**Ator:** Desenvolvedor | **História:** Como desenvolvedor, quero estruturar frontend e backend em monorepo com GitFlow para isolar features e integrar via Pull Requests.

**✅ Critérios de Aceitação:**

- [ ] O repositório deve ter estrutura clara para app frontend e app backend.
- [ ] As features devem ser desenvolvidas em branches específicas.
- [ ] A integração deve acontecer por Pull Request com revisão.
- [ ] O histórico deve evidenciar estratégia GitFlow aplicada.

**🔎 Rastreabilidade Checklist:** ID2, ID4

### 🔴 US03 - Backlog no GitHub Projects (Must Have)

**Ator:** Product Owner do Projeto | **História:** Como responsável pelo produto, quero mapear o PRD em User Stories no GitHub Projects para manter backlog rastreável por issues.

**✅ Critérios de Aceitação:**

- [ ] Cada User Story do PRD deve ter issue correspondente.
- [ ] As issues devem conter prioridade, labels e status.
- [ ] O quadro deve refletir o fluxo To Do, In Progress e Done.
- [ ] Cada entrega deve ser vinculada ao ID de avaliação aplicável.

**🔎 Rastreabilidade Checklist:** ID3

### 🔴 US04 - Arquitetura em Camadas no NestJS (Must Have)

**Ator:** Desenvolvedor Backend | **História:** Como desenvolvedor backend, quero separar Controllers, Services e Modules para garantir manutenção e escalabilidade da API.

**✅ Critérios de Aceitação:**

- [ ] Endpoints HTTP devem estar apenas em Controllers.
- [ ] Regras de negócio devem estar em Services.
- [ ] Composição por domínio deve estar em Modules.
- [ ] Não deve existir regra de negócio em camada incorreta.

**🔎 Rastreabilidade Checklist:** ID5

### 🔴 US05 - DTOs e Blindagem de Entrada (Must Have)

**Ator:** Sistema | **História:** Como sistema, quero validar entradas com DTOs e ValidationPipe com whitelist para impedir dados inválidos e campos inesperados.

**✅ Critérios de Aceitação:**

- [ ] DTOs devem ser usados nas operações de criação e atualização.
- [ ] ValidationPipe global deve estar ativo com whitelist true.
- [ ] Payload inválido deve retornar erro consistente e auditável.
- [ ] Campos não previstos devem ser descartados ou bloqueados conforme regra.

**🔎 Rastreabilidade Checklist:** ID6

### 🔴 US06 - CRUD Relacional com Prisma ORM (Must Have)

**Ator:** Designer | **História:** Como designer, quero cadastrar projetos e relacionar paletas, tipografias e assets para centralizar a identidade visual por projeto.

**✅ Critérios de Aceitação:**

- [ ] Deve existir CRUD completo para Projeto, Paleta, Tipografia e Asset.
- [ ] Os relacionamentos devem ser persistidos via Prisma ORM.
- [ ] Atualizações e exclusões devem respeitar integridade referencial.
- [ ] A leitura deve retornar os vínculos corretos entre entidades.

**🔎 Rastreabilidade Checklist:** ID7

### 🔴 US07 - Autenticação JWT e Controle de Acesso (Must Have)

**Ator:** Usuário Autenticado | **História:** Como usuário autenticado, quero acessar rotas com JWT e permissões por papel para manter segurança e isolamento de ações.

**✅ Critérios de Aceitação:**

- [ ] O login deve emitir JWT válido com expiração definida.
- [ ] Rotas privadas devem exigir autenticação por guard.
- [ ] Regras de roles devem proteger ações sensíveis.
- [ ] Usuário sem permissão deve receber resposta padronizada de acesso negado.

**🔎 Rastreabilidade Checklist:** ID8

### 🔴 US08 - Padronização de Respostas e Erros (Must Have)

**Ator:** Consumidor da API | **História:** Como consumidor da API, quero receber respostas e erros padronizados para integrar frontend e testes com previsibilidade.

**✅ Critérios de Aceitação:**

- [ ] Interceptor global deve padronizar contratos de sucesso.
- [ ] Exception Filter global deve padronizar contratos de erro.
- [ ] Erros devem trazer mensagem clara e código consistente.
- [ ] O padrão deve ser aplicado em todos os módulos da API.

**🔎 Rastreabilidade Checklist:** ID9

### 🔴 US09 - TDD com Jest Guiado por Issues (Must Have)

**Ator:** Desenvolvedor | **História:** Como desenvolvedor, quero escrever testes automatizados antes da lógica para evoluir com segurança no ciclo Red-Green-Refactor.

**✅ Critérios de Aceitação:**

- [ ] Cada issue técnica deve ter casos de teste associados.
- [ ] Testes devem cobrir cenários de sucesso e erro.
- [ ] A implementação só deve ser considerada pronta com testes passando.
- [ ] O fluxo de trabalho deve evidenciar prática TDD.

**🔎 Rastreabilidade Checklist:** ID10, ID11

### 🔴 US10 - Contrato OpenAPI com Swagger (Must Have)

**Ator:** Time Frontend | **História:** Como integrante do frontend, quero documentação Swagger atualizada para descobrir e validar endpoints sem ambiguidade.

**✅ Critérios de Aceitação:**

- [ ] Swagger deve estar disponível em rota pública da API.
- [ ] DTOs e schemas devem refletir o contrato real dos endpoints.
- [ ] Endpoints protegidos devem indicar autenticação necessária.
- [ ] Mudanças de API devem atualizar a documentação.

**🔎 Rastreabilidade Checklist:** ID12

### 🔴 US11 - Interface Visual Derivada do PRD (Must Have)

**Ator:** Designer | **História:** Como designer, quero uma interface web baseada no PRD para operar os fluxos de branding de forma intuitiva.

**✅ Critérios de Aceitação:**

- [ ] Devem existir telas de login, dashboard, projetos e detalhes.
- [ ] A interface deve refletir entidades reais do domínio.
- [ ] A navegação deve cobrir a jornada principal de uso.
- [ ] O frontend deve estar alinhado ao escopo funcional documentado.

**🔎 Rastreabilidade Checklist:** ID13

### 🔴 US12 - Integração Full-Cycle, Segurança Operacional e Deploy (Must Have)

**Ator:** Mantenedor do Produto | **História:** Como mantenedor, quero integrar frontend com API real via JWT, proteger segredos, validar no CI e publicar em nuvem para garantir operação contínua.

**✅ Critérios de Aceitação:**

- [ ] O frontend deve consumir API NestJS com token JWT em rotas autenticadas.
- [ ] Variáveis sensíveis devem ficar fora do repositório e ser carregadas via ConfigModule.
- [ ] GitHub Actions deve executar lint e testes automaticamente antes do merge.
- [ ] A aplicação deve estar publicada em domínio público com banco relacional em produção.

**🔎 Rastreabilidade Checklist:** ID14, ID15, ID16, ID17

## 🛡️ 5. Regras de Negócio (Constraints)

- **RN01 (Segurança de Acesso):** Toda operação privada depende de JWT válido e regras de autorização por papel.
- **RN02 (Integridade de Domínio):** Paletas, tipografias e assets devem sempre pertencer a um projeto válido.
- **RN03 (Contrato de API):** Toda resposta da API deve seguir o padrão global definido por Interceptor/Filter.
- **RN04 (Rastreabilidade Acadêmica):** Cada história implementada deve referenciar ao menos um ID da checklist de avaliação.
- **RN05 (Governança de Entrega):** Nenhuma mudança funcional pode ser integrada sem passar por pipeline de CI.

## 🚫 6. Fora de Escopo (Non-goals)

- Edição avançada de imagens dentro da plataforma.
- Marketplace de templates de branding.
- Aplicativos mobile nativos (APK/IPA) no MVP.
- Ferramentas de colaboração em tempo real com edição simultânea de arquivos visuais.

## ⚙️ 7. Requisitos Não Funcionais (Qualidade)

- **Arquitetura:** O backend deve manter separação estrita de camadas (Controllers, Services, Modules).
- **Segurança:** Entradas devem ser validadas com DTO + ValidationPipe (whitelist) e segredos devem ser externalizados.
- **Confiabilidade:** Exceções e respostas devem seguir padrão global consistente.
- **Qualidade de Código:** Suíte de testes automatizados deve cobrir caminhos de sucesso e erro.
- **Entrega Contínua:** CI deve bloquear merge em caso de falha de lint/testes.
- **Operação em Produção:** Sistema deve estar acessível em domínio público com banco relacional ativo.

## 📌 8. Matriz de Cobertura dos Requisitos de Avaliação

| ID Checklist | Coberto por |
| ------------ | ----------- |
| ID1          | US01        |
| ID2          | US02        |
| ID3          | US03        |
| ID4          | US02        |
| ID5          | US04        |
| ID6          | US05        |
| ID7          | US06        |
| ID8          | US07        |
| ID9          | US08        |
| ID10         | US09        |
| ID11         | US09        |
| ID12         | US10        |
| ID13         | US11        |
| ID14         | US12        |
| ID15         | US12        |
| ID16         | US12        |
| ID17         | US12        |
