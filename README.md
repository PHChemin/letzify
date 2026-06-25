# 📍 Letzify

# Letzify - Gestor de Identidade Visual

**Status do Sistema:**
[![CI - Develop (Laboratório)](https://github.com/seu-usuario/letzify/actions/workflows/ci.yml/badge.svg)](https://github.com/seu-usuario/letzify/actions/workflows/ci.yml)
[![CI - Main (Produção)](https://github.com/seu-usuario/letzify/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/seu-usuario/letzify/actions/workflows/ci.yml)

🔗 **Link em Produção:** Aguardando Deploy na Nuvem  
👨‍💻 **Autores:** Pedro Henrique Chemin Prado

## 🎯 1. Visão Geral

O **Letzify** é uma plataforma Full-Cycle para gerenciamento de identidade visual voltada a designers. O sistema centraliza projetos de branding em um único lugar, organizando paletas de cores, tipografias e assets visuais para manter consistência entre entregas, versões e clientes.

## 📚 2. Documentação Oficial (Docs as Code)

Toda a especificação do sistema está versionada na pasta `/docs`:

- 📄 **[PRD (Product Requirements Document)](./docs/prd.md):** Visão do produto, regras de negócio e user stories.
- 📐 **[SDD (Software Design Document)](./docs/sdd.md):** Arquitetura, diagrama ER (Mermaid), DTOs e decisões técnicas.
- ✅ **[Checklist de Avaliação](./docs/checklist.md):** Controle de entrega dos IDs e Resultados de Aprendizagem (RA).

## 🎨 Protótipo UI/UX

Este projeto inclui um protótipo de alta fidelidade criado via IA (Stitch), representando os principais fluxos de usuário e interface baseados no PRD.

🔗 Link do Protótipo: https://stitch.withgoogle.com/projects/3118950778668959974

## 🛠 3. Stack Tecnológica

- **Arquitetura:** Monorepo com backend e frontend no mesmo repositório.
- **Backend (API):** NestJS, TypeScript, JWT, Passport e Prisma ORM.
- **Banco de Dados:** PostgreSQL (Nuvem) gerenciado via Prisma ORM.
- **Frontend:** Vue 3 + TypeScript + Vite.
- **Integração:** Consumo direto da API REST com autenticação via JWT.

## 🚀 4. Quick Start (Como Executar)

**1. Clone o repositório:**

    git clone https://github.com/seu-usuario/letzify.git
    cd letzify

**2. Instale as dependências:**
Como é um Monorepo, você precisa instalar os pacotes em cada camada:

    # Terminal 1 - Iniciar a API NestJS
    cd apps/api
    npm install
    npm run start:dev

    # Terminal 2 - Iniciar o Frontend Vue 3
    cd apps/web
    npm install
    npm run dev

**3. Variáveis de Ambiente:**

Copie o arquivo `.env.example` para `.env` dentro de `apps/api` e configure, no mínimo, a `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` e `CORS_ORIGIN` (ex: `http://localhost:5173`).

Copie também `apps/web/.env.example` para `apps/web/.env` e configure `VITE_API_URL` (ex: `http://localhost:3000/api`).

**4. Seed (usuários de demonstração):**

    cd apps/api
    npm run db:seed

Credenciais criadas pelo seed:

- `admin@letzify.com` / `Letzify123` (ADMIN)
- `designer@letzify.com` / `Letzify123` (USER/Designer)

## 📌 5. Funcionalidades Principais

- Criação e gerenciamento de projetos de identidade visual;
- Definição de paletas de cores;
- Gerenciamento de tipografias;
- Upload e organização de assets visuais (logos, imagens, mockups);
- Autenticação segura por JWT;
- Consumo do backend por interface web em Vue 3.

## 🔄 6. Integração Contínua (CI)

A esteira de CI roda automaticamente via **GitHub Actions** em push e pull request para as branches `main` e `develop`.

Arquivo: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

**Validações executadas:**

1. **Lint** da API (ESLint)
2. **Testes** automatizados da API (Jest)
3. **Build** do monorepo (NestJS + Vue)

Para reproduzir localmente:

    npm run ci

**Branch protection (recomendado):** configure no GitHub que PRs para `main`/`develop` exijam o check **Lint, Test and Build** antes do merge (RN05 do PRD).

## 🐳 7. Deploy com Docker (DigitalOcean)

O deploy usa **Docker Compose** com dois serviços: API (NestJS) e Web (Nginx + Vue).

### Pré-requisitos

- Droplet Ubuntu na DigitalOcean com Docker instalado
- Banco PostgreSQL no [Neon.tech](https://neon.tech) já configurado (apenas informe a `DATABASE_URL` no `.env`)

### Passo a passo no servidor

**1. Instalar Docker (no Droplet):**

    curl -fsSL https://get.docker.com | sh

**2. Clonar o repositório:**

    git clone https://github.com/seu-usuario/letzify.git
    cd letzify

**3. Configurar variáveis de ambiente:**

    cp .env.docker.example .env
    nano .env

Preencha `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` (URL do frontend) e `API_PUBLIC_URL` (URL + `/api`).

**4. Subir a aplicação:**

    docker compose up -d --build

A aplicação ficará disponível em `http://SEU_IP` (porta 80).

- **Frontend:** `http://SEU_IP`
- **API:** `http://SEU_IP/api`
- **Swagger:** `http://SEU_IP/docs`

### HTTPS com domínio próprio

**1.** Aponte o DNS do domínio (registro **A**) para o IP do Droplet.

**2.** No `.env`, defina:

    DOMAIN=letzify.seudominio.com
    CERTBOT_EMAIL=seu@email.com
    CORS_ORIGIN=https://letzify.seudominio.com
    API_PUBLIC_URL=https://letzify.seudominio.com/api

**3.** Suba (ou reinicie) os containers:

    docker compose up -d --build

**4.** Gere o certificado Let's Encrypt (uma vez, com o DNS já propagado):

    chmod +x docker/certbot/init-letsencrypt.sh
    ./docker/certbot/init-letsencrypt.sh

O script obtém o certificado e reinicia o Nginx com HTTPS ativo.

- **Frontend:** `https://letzify.seudominio.com`
- **API:** `https://letzify.seudominio.com/api`
- **Swagger:** `https://letzify.seudominio.com/docs`

O serviço `certbot` renova o certificado automaticamente a cada 12 horas. Libere a porta **443** no firewall da DigitalOcean.

Para testar sem consumir o limite do Let's Encrypt, use `CERTBOT_STAGING=1` no `.env` antes de rodar o script.

### Comandos úteis

    docker compose logs -f          # ver logs
    docker compose ps               # status dos containers
    docker compose down             # parar tudo
    docker compose up -d --build    # rebuild após atualizar código
