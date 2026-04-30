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
Copie o arquivo `.env.example` para `.env` dentro de `apps/api` e configure, no mínimo, a `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` e `CORS_ORIGIN`.

## 📌 5. Funcionalidades Principais

- Criação e gerenciamento de projetos de identidade visual;
- Definição de paletas de cores;
- Gerenciamento de tipografias;
- Upload e organização de assets visuais (logos, imagens, mockups);
- Autenticação segura por JWT;
- Consumo do backend por interface web em Vue 3.
